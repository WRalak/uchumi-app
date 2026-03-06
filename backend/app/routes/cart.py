from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Cart, CartItem, Product, User

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/', methods=['GET'])
@jwt_required()
def get_cart():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user.cart:
        # Create cart if doesn't exist
        cart = Cart(user_id=user.id)
        db.session.add(cart)
        db.session.commit()
    
    cart_items = [item.to_dict() for item in user.cart.items]
    
    return jsonify({
        'cart_id': user.cart.id,
        'items': cart_items,
        'total': user.cart.get_total()
    }), 200

@cart_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()
    
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    if not product_id:
        return jsonify({'error': 'Product ID required'}), 400
    
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    if product.stock < quantity:
        return jsonify({'error': 'Insufficient stock'}), 400
    
    # Check if product already in cart
    cart_item = CartItem.query.filter_by(
        cart_id=user.cart.id,
        product_id=product_id
    ).first()
    
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(
            cart_id=user.cart.id,
            product_id=product_id,
            quantity=quantity
        )
        db.session.add(cart_item)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Item added to cart',
        'cart_item': cart_item.to_dict()
    }), 200

@cart_bp.route('/update/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    current_user_id = get_jwt_identity()
    cart_item = CartItem.query.get_or_404(item_id)
    
    # Check if cart belongs to user
    if cart_item.cart.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    new_quantity = data.get('quantity')
    
    if not new_quantity or new_quantity < 1:
        return jsonify({'error': 'Invalid quantity'}), 400
    
    # Check stock
    if cart_item.product.stock < new_quantity:
        return jsonify({'error': 'Insufficient stock'}), 400
    
    cart_item.quantity = new_quantity
    db.session.commit()
    
    return jsonify({
        'message': 'Cart updated',
        'cart_item': cart_item.to_dict()
    }), 200

@cart_bp.route('/remove/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    current_user_id = get_jwt_identity()
    cart_item = CartItem.query.get_or_404(item_id)
    
    # Check if cart belongs to user
    if cart_item.cart.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(cart_item)
    db.session.commit()
    
    return jsonify({'message': 'Item removed from cart'}), 200

@cart_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    CartItem.query.filter_by(cart_id=user.cart.id).delete()
    db.session.commit()
    
    return jsonify({'message': 'Cart cleared'}), 200
