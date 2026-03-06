from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Order, OrderItem, Cart, Product, User
from datetime import datetime

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    current_user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=current_user_id).order_by(Order.order_date.desc()).all()
    
    return jsonify([order.to_dict() for order in orders]), 200

@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    current_user_id = get_jwt_identity()
    order = Order.query.get_or_404(order_id)
    
    # Check if order belongs to user or user is admin
    user = User.query.get(current_user_id)
    if order.user_id != current_user_id and not user.is_admin:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(order.to_dict()), 200

@orders_bp.route('/create', methods=['POST'])
@jwt_required()
def create_order():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()
    
    if not user.cart or not user.cart.items:
        return jsonify({'error': 'Cart is empty'}), 400
    
    # Validate required fields
    if not data.get('shipping_address'):
        return jsonify({'error': 'Shipping address required'}), 400
    
    if not data.get('payment_method'):
        return jsonify({'error': 'Payment method required'}), 400
    
    # Check stock for all items
    for cart_item in user.cart.items:
        if cart_item.product.stock < cart_item.quantity:
            return jsonify({
                'error': f'Insufficient stock for {cart_item.product.name}'
            }), 400
    
    # Create order
    order = Order(
        user_id=current_user_id,
        total_amount=user.cart.get_total(),
        shipping_address=data['shipping_address'],
        payment_method=data['payment_method'],
        status='pending'
    )
    
    db.session.add(order)
    db.session.flush()  # Get order ID
    
    # Create order items and update stock
    for cart_item in user.cart.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price_at_time=cart_item.product.price
        )
        db.session.add(order_item)
        
        # Update stock
        cart_item.product.stock -= cart_item.quantity
    
    # Clear cart
    CartItem.query.filter_by(cart_id=user.cart.id).delete()
    
    db.session.commit()
    
    return jsonify({
        'message': 'Order created successfully',
        'order': order.to_dict()
    }), 201

@orders_bp.route('/<int:order_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_order(order_id):
    current_user_id = get_jwt_identity()
    order = Order.query.get_or_404(order_id)
    
    # Check if order belongs to user
    if order.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if order.status not in ['pending', 'paid']:
        return jsonify({'error': 'Order cannot be cancelled'}), 400
    
    order.status = 'cancelled'
    
    # Restore stock
    for item in order.items:
        product = Product.query.get(item.product_id)
        product.stock += item.quantity
    
    db.session.commit()
    
    return jsonify({
        'message': 'Order cancelled',
        'order': order.to_dict()
    }), 200
