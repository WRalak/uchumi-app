from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.models import User

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def owner_required(resource_owner_id_func):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            resource_owner_id = resource_owner_id_func(*args, **kwargs)
            
            if current_user_id != resource_owner_id:
                user = User.query.get(current_user_id)
                if not user or not user.is_admin:
                    return jsonify({'error': 'Unauthorized access'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
