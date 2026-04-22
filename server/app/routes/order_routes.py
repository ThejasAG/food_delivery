from flask import Blueprint
from app.controllers.order_controller import place_order, get_user_orders, get_order_status

order_bp = Blueprint('order', __name__)

order_bp.route('/place', methods=['POST'])(place_order)
order_bp.route('/history', methods=['GET'])(get_user_orders)
order_bp.route('/status/<int:order_id>', methods=['GET'])(get_order_status)
