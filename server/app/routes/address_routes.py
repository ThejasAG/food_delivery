from flask import Blueprint
from app.controllers.address_controller import get_user_addresses, add_address, delete_address

address_bp = Blueprint('address', __name__)

address_bp.route('/', methods=['GET'])(get_user_addresses)
address_bp.route('/', methods=['POST'])(add_address)
address_bp.route('/<int:address_id>', methods=['DELETE'])(delete_address)
