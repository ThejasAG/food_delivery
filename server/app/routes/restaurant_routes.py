from flask import Blueprint
from app.controllers.restaurant_controller import get_restaurants, get_restaurant_menu, seed_data

restaurant_bp = Blueprint('restaurant', __name__)

restaurant_bp.route('/', methods=['GET'])(get_restaurants)
restaurant_bp.route('/<int:restaurant_id>', methods=['GET'])(get_restaurant_menu)
restaurant_bp.route('/seed', methods=['POST'])(seed_data)
