from app import create_app, db

app = create_app()

if __name__ == '__main__':
    # With app context, create the database tables if they don't exist
    from app.models.user_model import User
    from app.models.restaurant_model import Restaurant, MenuItem
    from app.models.order_model import Order, OrderItem
    from app.models.cart_model import CartItem
    with app.app_context():
        db.create_all()

    app.run(debug=True, port=5000)
