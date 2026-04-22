from flask import request, jsonify
from app import db
from app.models.restaurant_model import Restaurant, MenuItem
from app.models.order_model import Order
from app.utils.auth_utils import admin_required
from flask_jwt_extended import jwt_required

@jwt_required()
@admin_required
def add_restaurant():
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({"message": "Name is required"}), 400
        
    new_restaurant = Restaurant(
        name=data.get('name'),
        image=data.get('image'),
        description=data.get('description'),
        cuisine=data.get('cuisine'),
        rating=data.get('rating', 0.0)
    )
    db.session.add(new_restaurant)
    db.session.commit()
    return jsonify({"message": "Restaurant added successfully", "restaurant": new_restaurant.to_dict()}), 201

@jwt_required()
@admin_required
def update_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"message": "Restaurant not found"}), 404

    data = request.get_json() or {}
    if not data.get('name'):
        return jsonify({"message": "Name is required"}), 400

    restaurant.name = data.get('name')
    restaurant.image = data.get('image')
    restaurant.description = data.get('description')
    restaurant.cuisine = data.get('cuisine')
    restaurant.rating = data.get('rating', restaurant.rating)

    db.session.commit()
    return jsonify({"message": "Restaurant updated successfully", "restaurant": restaurant.to_dict()}), 200

@jwt_required()
@admin_required
def update_admin_settings(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"message": "Restaurant not found"}), 404

    data = request.get_json() or {}
    
    # Update location
    if 'address_line' in data: restaurant.address_line = data['address_line']
    if 'landmark' in data: restaurant.landmark = data['landmark']
    if 'city' in data: restaurant.city = data['city']
    if 'pincode' in data: restaurant.pincode = data['pincode']
    if 'latitude' in data: restaurant.latitude = data['latitude']
    if 'longitude' in data: restaurant.longitude = data['longitude']
    
    # Update cutoffs
    if 'delivery_cutoff' in data: restaurant.delivery_cutoff = data['delivery_cutoff']
    if 'dine_in_takeaway_cutoff' in data: restaurant.dine_in_takeaway_cutoff = data['dine_in_takeaway_cutoff']
    
    # Update range
    if 'max_delivery_distance' in data: restaurant.max_delivery_distance = data['max_delivery_distance']

    db.session.commit()
    return jsonify({"message": "Settings updated successfully", "settings": restaurant.to_dict()}), 200

@jwt_required()
@admin_required
def add_menu_item():
    data = request.get_json()
    if not data or not data.get('restaurant_id') or not data.get('name') or not data.get('price'):
        return jsonify({"message": "restaurant_id, name, and price are required"}), 400
        
    new_item = MenuItem(
        restaurant_id=data.get('restaurant_id'),
        name=data.get('name'),
        price=data.get('price'),
        description=data.get('description'),
        category=data.get('category'),
        image=data.get('image'),
        is_available=data.get('is_available', True),
        quantity_available=data.get('quantity_available', 10)
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify({"message": "Menu item added successfully", "item": new_item.to_dict()}), 201

@jwt_required()
@admin_required
def update_menu_item(item_id):
    item = MenuItem.query.get(item_id)
    if not item:
        return jsonify({"message": "Menu item not found"}), 404

    data = request.get_json() or {}
    
    if 'name' in data: item.name = data['name']
    if 'price' in data: item.price = data['price']
    if 'description' in data: item.description = data['description']
    if 'category' in data: item.category = data['category']
    if 'image' in data: item.image = data['image']
    if 'is_available' in data: item.is_available = data['is_available']
    if 'quantity_available' in data: item.quantity_available = data['quantity_available']

    db.session.commit()
    return jsonify({"message": "Menu item updated successfully", "item": item.to_dict()}), 200

@jwt_required()
@admin_required
def get_all_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([order.to_dict() for order in orders]), 200

@jwt_required()
@admin_required
def update_order_status(order_id):
    data = request.get_json()
    if not data or not data.get('status'):
        return jsonify({"message": "Status is required"}), 400
        
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"message": "Order not found"}), 404
        
    new_status = data.get('status')
    valid_statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered']
    if new_status not in valid_statuses:
        return jsonify({"message": f"Invalid status. Must be one of {valid_statuses}"}), 400
        
    order.status = new_status
    db.session.commit()
    return jsonify({"message": "Order status updated", "new_status": order.status}), 200

@jwt_required()
@admin_required
def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"message": "Restaurant not found"}), 404
    
    # Delete associated menu items first
    MenuItem.query.filter_by(restaurant_id=restaurant_id).delete()
    db.session.delete(restaurant)
    db.session.commit()
    return jsonify({"message": "Restaurant and its menu deleted successfully"}), 200

@jwt_required()
@admin_required
def delete_menu_item(item_id):
    item = MenuItem.query.get(item_id)
    if not item:
        return jsonify({"message": "Menu item not found"}), 404
    
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Menu item deleted successfully"}), 200
