from app import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.Enum('Pending', 'Preparing', 'Out for Delivery', 'Delivered'), default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    order_type = db.Column(db.Enum('Dine-In', 'Takeaway', 'Delivery'), default='Delivery')
    address_id = db.Column(db.Integer, db.ForeignKey('addresses.id'), nullable=True)
    estimated_ready_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'restaurant_id': self.restaurant_id,
            'total_price': float(self.total_price),
            'status': self.status,
            'created_at': self.created_at.isoformat() + 'Z',
            'order_type': self.order_type,
            'address_id': self.address_id,
            'estimated_ready_at': self.estimated_ready_at.isoformat() + 'Z' if self.estimated_ready_at else None,
            'items': [item.to_dict() for item in self.items]
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False) # Price at the time of order

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'item_id': self.item_id,
            'quantity': self.quantity,
            'price': float(self.price)
        }
