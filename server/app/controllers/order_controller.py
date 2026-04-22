from flask import request, jsonify
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from decimal import Decimal
from datetime import datetime
from app.models.restaurant_model import Restaurant, MenuItem
from app.models.address_model import Address
from app.models.order_model import Order, OrderItem
from app.utils.location import calculate_distance

@jwt_required()
def place_order():
    """Place a new order from cart or specific items."""
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    # If items are provided in the request, use them; 
    # otherwise, pull from the user's persistent cart.
    items_data = data.get('items')
    restaurant_id = data.get('restaurant_id')
    
    from app.models.cart_model import CartItem
    if not items_data:
        cart_items = CartItem.query.filter_by(user_id=user_id).all()
        if not cart_items:
            return jsonify({"message": "Cart is empty"}), 400
        items_data = [{"item_id": ci.item_id, "quantity": ci.quantity} for ci in cart_items]
        # For simplicity, we assume all items in cart are from the same restaurant
        # In a real app, you'd group by restaurant or handle validation
        restaurant_id = cart_items[0].item.restaurant_id
        
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"message": "Restaurant not found"}), 404

    # 1. Validate Order Type and Timing
    order_type = data.get('order_type', 'Delivery')
    if order_type not in ['Takeaway', 'Delivery']:
        return jsonify({"message": "Invalid order type"}), 400

    current_time = datetime.now().strftime("%H:%M")
    if order_type == 'Delivery':
        if current_time > restaurant.delivery_cutoff:
            return jsonify({"message": "Orders are closed for delivery"}), 400
    else:
        if current_time > restaurant.dine_in_takeaway_cutoff:
            return jsonify({"message": "Takeaway is closed"}), 400

    # 2. Validate Distance (if Delivery)
    address_id = data.get('address_id')
    if order_type == 'Delivery':
        if not address_id:
            return jsonify({"message": "Delivery address is required"}), 400
        
        address = Address.query.filter_by(id=address_id, user_id=user_id).first()
        if not address:
            return jsonify({"message": "Address not found"}), 404
            
        dist = calculate_distance(
            restaurant.latitude, restaurant.longitude,
            address.latitude, address.longitude
        )
        
        if dist > restaurant.max_delivery_distance:
            return jsonify({"message": "Delivery address is outside our service range"}), 400

    delivery_fee = Decimal("2.50") if order_type == 'Delivery' else Decimal("0.00")
    total_price = delivery_fee
    order_items = []
    
    for item in items_data:
        item_id = item.get('item_id') if isinstance(item, dict) else None
        quantity = item.get('quantity') if isinstance(item, dict) else None

        if not item_id or not isinstance(quantity, int) or quantity <= 0:
            return jsonify({"message": "Each order item must include valid item_id and quantity"}), 400

        menu_item = MenuItem.query.get(item_id)
        if not menu_item:
            return jsonify({"message": f"Item {item_id} not found"}), 404

        if menu_item.restaurant_id != restaurant_id:
            return jsonify({"message": "All items must belong to the selected restaurant"}), 400
        
        # 3. Validate Availability and Stock
        if not menu_item.is_available:
            return jsonify({"message": f"Item {menu_item.name} is currently unavailable"}), 400
        
        if menu_item.quantity_available < quantity:
            return jsonify({"message": f"Item {menu_item.name} is out of stock"}), 400
        
        item_total = menu_item.price * quantity
        total_price += item_total
        
        # Update stock
        menu_item.quantity_available -= quantity
        
        order_items.append(OrderItem(
            item_id=menu_item.id,
            quantity=quantity,
            price=menu_item.price
        ))
    
    new_order = Order(
        user_id=user_id,
        restaurant_id=restaurant_id,
        total_price=total_price,
        items=order_items,
        order_type=order_type,
        address_id=address_id
    )
    
    db.session.add(new_order)
    
    # Clear the cart after successful order
    from app.models.cart_model import CartItem
    CartItem.query.filter_by(user_id=user_id).delete()
    
    db.session.commit()
    
    return jsonify({
        "message": "Order placed successfully",
        "order": new_order.to_dict(),
        "delivery_fee": float(delivery_fee)
    }), 201

@jwt_required()
def get_user_orders():
    """Get order history for the logged-in user."""
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify([order.to_dict() for order in orders]), 200

@jwt_required()
def get_order_status(order_id):
    """Get status of a specific order."""
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    
    if not order:
        return jsonify({"message": "Order not found"}), 404
        
    return jsonify({
        "order_id": order.id,
        "status": order.status
    }), 200
