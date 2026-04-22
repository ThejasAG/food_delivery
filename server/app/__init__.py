from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from app.config import Config

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions with the app context
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Register blueprints (routes)
    from app.routes.auth_routes import auth_bp
    from app.routes.restaurant_routes import restaurant_bp
    from app.routes.order_routes import order_bp
    from app.routes.cart_routes import cart_bp
    from app.routes.admin_routes import admin_bp
    from app.routes.address_routes import address_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(restaurant_bp, url_prefix='/api/restaurants')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(address_bp, url_prefix='/api/address')

    @app.route('/')
    def index():
        return {"message": "Welcome to the Food Delivery API"}

    return app
