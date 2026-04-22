from flask import request, jsonify
from app import db
from app.models.restaurant_model import Restaurant, MenuItem

def get_restaurants():
    """Fetch all restaurants."""
    restaurants = Restaurant.query.all()
    return jsonify([r.to_dict() for r in restaurants]), 200

def get_restaurant_menu(restaurant_id):
    """Fetch menu for a specific restaurant."""
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"message": "Restaurant not found"}), 404
        
    menu = MenuItem.query.filter_by(restaurant_id=restaurant_id).all()
    return jsonify({
        "restaurant": restaurant.to_dict(),
        "menu": [item.to_dict() for item in menu]
    }), 200

def seed_data():
    """Optional: Seed some initial data for testing."""
    if Restaurant.query.first():
        return jsonify({"message": "Database already has data"}), 400

    # Sample Restaurant
    r1 = Restaurant(
        name="Burger King",
        image="https://images.unsplash.com/photo-1571091718767-18b5b1457add",
        description="Best burgers in town",
        cuisine="Fast Food",
        rating=4.5
    )
    r2 = Restaurant(
        name="Pizza Hut",
        image="https://images.unsplash.com/photo-1513104890138-7c749659a591",
        description="Freshly baked pizzas",
        cuisine="Italian",
        rating=4.2
    )
    
    db.session.add_all([r1, r2])
    db.session.commit()

    # Sample Menu Items
    items = [
        MenuItem(restaurant_id=r1.id, name="Whopper", price=5.99, description="Classic beef burger", category="Main"),
        MenuItem(restaurant_id=r1.id, name="Fries", price=2.99, description="Golden crispy fries", category="Sides"),
        MenuItem(restaurant_id=r2.id, name="Margherita", price=8.99, description="Classic cheese pizza", category="Pizza"),
        MenuItem(restaurant_id=r2.id, name="Pepperoni", price=10.99, description="Spicy pepperoni pizza", category="Pizza"),
    ]
    
    db.session.add_all(items)
    db.session.commit()
    
    return jsonify({"message": "Sample data seeded successfully"}), 201
