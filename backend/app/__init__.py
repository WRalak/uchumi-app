from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    
    # Force SQLite - ignore whatever is in .env
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'  # HARDCODED SQLITE
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    
    # Configure CORS
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.cart import cart_bp
    from app.routes.orders import orders_bp
    from app.routes.admin import admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Create tables
    with app.app_context():
        try:
            db.create_all()
            print("✓ Database tables created successfully")
        except Exception as e:
            print(f"Warning: Could not create tables: {e}")
    
    return app