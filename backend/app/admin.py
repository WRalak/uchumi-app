from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Product, Category, Order, User
from app.utils.decorators import admin_required

admin_bp = Blueprint('admin', __name__)

# Product Management
@admin_bp.route('/products', methods=['POST'])
@jwt_required()
@admin_required
def create_product():
    data = request.get_json()
    
    required_fields = ['name', 'price', 'stock']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        stock=data['stock'],
        image_url=data.get('image_url', ''),
        category_id=data.get('category_id')
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({
        'message': 'Product created',
        'product': product.to_dict()
    }), 201

@admin_bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'price' in data:
        product.price = data['price']
    if 'stock' in data:
        product.stock = data['stock']
    if 'image_url' in data:
        product.image_url = data['image_url']
    if 'category_id' in data:
        product.category_id = data['category_id']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Product updated',
        'product': product.to_dict()
    }), 200

@admin_bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({'message': 'Product deleted'}), 200

# Category Management
@admin_bp.route('/categories', methods=['POST'])
@jwt_required()
@admin_required
def create_category():
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Category name required'}), 400
    
    category = Category(
        name=data['name'],
        description=data.get('description', '')
    )
    
    db.session.add(category)
    db.session.commit()
    
    return jsonify({
        'message': 'Category created',
        'category': category.to_dict()
    }), 201

@admin_bp.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_category(category_id):
    category = Category.query.get_or_404(category_id)
    data = request.get_json()
    
    if 'name' in data:
        category.name = data['name']
    if 'description' in data:
        category.description = data['description']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Category updated',
        'category': category.to_dict()
    }), 200

@admin_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_category(category_id):
    category = Category.query.get_or_404(category_id)
    
    # Check if category has products
    if category.products:
        return jsonify({'error': 'Cannot delete category with products'}), 400
    
    db.session.delete(category)
    db.session.commit()
    
    return jsonify({'message': 'Category deleted'}), 200

# Order Management
@admin_bp.route('/orders', methods=['GET'])
@jwt_required()
@admin_required
def get_all_orders():
    status = request.args.get('status')
    
    query = Order.query
    if status:
        query = query.filter_by(status=status)
    
    orders = query.order_by(Order.order_date.desc()).all()
    
    return jsonify([order.to_dict() for order in orders]), 200

@admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
@admin_required
def update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.get_json()
    
    new_status = data.get('status')
    valid_statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
    
    if new_status not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400
    
    order.status = new_status
    db.session.commit()
    
    return jsonify({
        'message': 'Order status updated',
        'order': order.to_dict()
    }), 200

# User Management
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200