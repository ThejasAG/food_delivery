from flask import Blueprint
from app.controllers.admin_controller import (
    add_restaurant, update_restaurant, add_menu_item, get_all_orders, 
    update_order_status, delete_restaurant, delete_menu_item,
    update_admin_settings, update_menu_item, upload_image, update_order_prep_time
)

admin_bp = Blueprint('admin', __name__)

admin_bp.route('/restaurants', methods=['POST'])(add_restaurant)
admin_bp.route('/restaurants/<int:restaurant_id>', methods=['PUT'])(update_restaurant)
admin_bp.route('/menu', methods=['POST'])(add_menu_item)
admin_bp.route('/orders', methods=['GET'])(get_all_orders)
admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])(update_order_status)
admin_bp.route('/restaurants/<int:restaurant_id>', methods=['DELETE'])(delete_restaurant)
admin_bp.route('/menu/<int:item_id>', methods=['DELETE'])(delete_menu_item)
admin_bp.route('/settings/<int:restaurant_id>', methods=['PUT'])(update_admin_settings)
admin_bp.route('/menu/<int:item_id>', methods=['PUT'])(update_menu_item)
admin_bp.route('/upload-image', methods=['POST'])(upload_image)
admin_bp.route('/orders/<int:order_id>/prep-time', methods=['PUT'])(update_order_prep_time)
