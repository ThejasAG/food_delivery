from app import db

class Restaurant(db.Model):
    __tablename__ = 'restaurants'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    cuisine = db.Column(db.String(50), nullable=True)
    rating = db.Column(db.Numeric(2, 1), default=0.0)
    
    # Location and Settings
    address_line = db.Column(db.String(255), nullable=True)
    landmark = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    pincode = db.Column(db.String(20), nullable=True)
    latitude = db.Column(db.Numeric(10, 8), nullable=True)
    longitude = db.Column(db.Numeric(11, 8), nullable=True)
    delivery_cutoff = db.Column(db.String(5), default="22:00") # HH:MM format
    dine_in_takeaway_cutoff = db.Column(db.String(5), default="23:00") # HH:MM format
    max_delivery_distance = db.Column(db.Float, default=1.0) # in km

    # Relationship to Menu Items
    menu_items = db.relationship('MenuItem', backref='restaurant', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'image': self.image,
            'description': self.description,
            'cuisine': self.cuisine,
            'rating': float(self.rating) if self.rating else 0.0,
            'address_line': self.address_line,
            'landmark': self.landmark,
            'city': self.city,
            'pincode': self.pincode,
            'latitude': float(self.latitude) if self.latitude else None,
            'longitude': float(self.longitude) if self.longitude else None,
            'delivery_cutoff': self.delivery_cutoff,
            'dine_in_takeaway_cutoff': self.dine_in_takeaway_cutoff,
            'max_delivery_distance': self.max_delivery_distance
        }

class MenuItem(db.Model):
    __tablename__ = 'menu_items'

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=True)
    image = db.Column(db.String(255), nullable=True)
    is_available = db.Column(db.Boolean, default=True)
    quantity_available = db.Column(db.Integer, default=10)

    def to_dict(self):
        return {
            'id': self.id,
            'restaurant_id': self.restaurant_id,
            'name': self.name,
            'price': float(self.price),
            'description': self.description,
            'category': self.category,
            'image': self.image,
            'is_available': self.is_available,
            'quantity_available': self.quantity_available
        }
