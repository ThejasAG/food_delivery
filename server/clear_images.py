from app import create_app, db
from app.models.restaurant_model import Restaurant, MenuItem

app = create_app()
with app.app_context():
    # Clear all images to let the admin start fresh
    for r in Restaurant.query.all():
        r.image = None
    
    for m in MenuItem.query.all():
        m.image = None
    
    db.session.commit()
    print("All image paths cleared from the database.")
