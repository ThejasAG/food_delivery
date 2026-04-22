from flask import request, jsonify
from app import db
from app.models.cart_model import CartItem
from app.models.restaurant_model import MenuItem
from flask_jwt_extended import jwt_required, get_jwt_identity

@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('item_id'):
        return jsonify({"message": "Item ID required"}), 400
        
    item_id = data.get('item_id')
    quantity = data.get('quantity', 1)
    
    # Check if item exists in menu
    if not MenuItem.query.get(item_id):
        return jsonify({"message": "Item not found"}), 404
        
    # Check if item already in cart, if so update quantity
    existing_item = CartItem.query.filter_by(user_id=user_id, item_id=item_id).first()
    if existing_item:
        existing_item.quantity += quantity
    else:
        new_cart_item = CartItem(user_id=user_id, item_id=item_id, quantity=quantity)
        db.session.add(new_cart_item)
        
    db.session.commit()
    return jsonify({"message": "Item added to cart"}), 200

@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    total_price = 0
    items_list = []
    for item in cart_items:
        items_list.append(item.to_dict())
        total_price += float(item.item.price) * item.quantity
        
    return jsonify({
        "items": items_list,
        "total_price": total_price
    }), 200

@jwt_required()
def remove_from_cart(item_id):
    user_id = get_jwt_identity()
    cart_item = CartItem.query.filter_by(user_id=user_id, item_id=item_id).first()
    
    if not cart_item:
        return jsonify({"message": "Item not in cart"}), 404
        
    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "Item removed from cart"}), 200

@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({"message": "Cart cleared"}), 200
