from app import db

class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)

    # Relationships
    item = db.relationship('MenuItem', backref='carts')

    def to_dict(self):
        return {
            'id': self.id,
            'item_id': self.item_id,
            'quantity': self.quantity,
            'item_details': self.item.to_dict() if self.item else None
        }
