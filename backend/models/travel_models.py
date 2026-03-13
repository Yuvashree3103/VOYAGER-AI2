from database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Agency(db.Model):
    __tablename__ = 'agencies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(255))
    location = db.Column(db.String(100))
    tour_types = db.Column(db.String(255))  # Comma-separated or JSON
    starting_price = db.Column(db.Float)
    rating = db.Column(db.Float, default=4.5)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'image_url': self.image_url,
            'location': self.location,
            'tour_types': self.tour_types.split(',') if self.tour_types else [],
            'starting_price': self.starting_price,
            'rating': self.rating
        }

class Guide(db.Model):
    __tablename__ = 'guides'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    photo_url = db.Column(db.String(255))
    languages = db.Column(db.String(255))
    service_areas = db.Column(db.String(255))
    daily_fee = db.Column(db.Float)
    rating = db.Column(db.Float, default=4.5)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'photo_url': self.photo_url,
            'languages': self.languages.split(',') if self.languages else [],
            'service_areas': self.service_areas.split(',') if self.service_areas else [],
            'daily_fee': self.daily_fee,
            'rating': self.rating
        }

class TourPackage(db.Model):
    __tablename__ = 'tour_packages'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(255))
    duration = db.Column(db.String(50))
    locations = db.Column(db.String(255))
    price_per_person = db.Column(db.Float)
    rating = db.Column(db.Float, default=4.5)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'image_url': self.image_url,
            'duration': self.duration,
            'locations': self.locations.split(',') if self.locations else [],
            'price_per_person': self.price_per_person,
            'rating': self.rating
        }

class Food(db.Model):
    __tablename__ = 'foods'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(255))
    location = db.Column(db.String(100))  # Category: Chennai, Madurai, etc.
    price_range = db.Column(db.String(50))
    rating = db.Column(db.Float, default=4.5)
    description = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'image_url': self.image_url,
            'location': self.location,
            'price_range': self.price_range,
            'rating': self.rating,
            'description': self.description
        }

class Destination(db.Model):
    __tablename__ = 'destinations'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(255))
    description = db.Column(db.Text)
    category = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'image_url': self.image_url,
            'description': self.description,
            'category': self.category
        }

class TravelFeature(db.Model):
    __tablename__ = 'travel_features'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    icon = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'icon': self.icon
        }
