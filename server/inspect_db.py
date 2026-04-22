from app import create_app, db
from app.models.restaurant_model import Restaurant, MenuItem

app = create_app()
with app.app_context():
    print("RESTAURANTS:")
    for r in Restaurant.query.all():
        print(f"ID: {r.id}, Name: {r.name}, Image: {r.image}")
    
    print("\nMENU ITEMS:")
    for m in MenuItem.query.all():
        print(f"ID: {m.id}, Name: {m.name}, RestaurantID: {m.restaurant_id}, Image: {m.image}")
