from flask import Blueprint
from app.controllers.cart_controller import add_to_cart, get_cart, remove_from_cart, clear_cart

cart_bp = Blueprint('cart', __name__)

cart_bp.route('/', methods=['GET'])(get_cart)
cart_bp.route('/add', methods=['POST'])(add_to_cart)
cart_bp.route('/remove/<int:item_id>', methods=['DELETE'])(remove_from_cart)
cart_bp.route('/clear', methods=['DELETE'])(clear_cart)
