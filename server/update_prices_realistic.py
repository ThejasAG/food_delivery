from app import create_app, db
from app.models.restaurant_model import MenuItem

app = create_app()
with app.app_context():
    # Update realistic Indian prices
    updates = {
        "Whopper": 199.00,
        "Fries": 99.00,
        "Cheese Burger": 149.00,
        "Margherita Pizza": 249.00,
        "Pepperoni Pizza": 349.00,
    }
    
    for name, price in updates.items():
        items = MenuItem.query.filter(MenuItem.name.ilike(f"%{name}%")).all()
        for item in items:
            item.price = price
            print(f"Updated {item.name} to {price}")
    
    # Catch-all for other cheap items
    all_items = MenuItem.query.all()
    for item in all_items:
        if item.price < 50:
            item.price = item.price * 80 # Simple conversion if not explicitly mapped
            print(f"Converted {item.name} to approx {item.price:.2f}")
            
    db.session.commit()
    print("All menu prices updated to realistic Indian Rupee values.")
