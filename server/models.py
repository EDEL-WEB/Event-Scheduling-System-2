from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)

    events = db.relationship('Event', backref='creator', cascade='all, delete-orphan')
    bookings = db.relationship('Booking', backref='user', cascade='all, delete-orphan')

    
    serialize_rules = (
        '-password_hash',
        '-events.creator',
        '-events.bookings',
        '-bookings.user',
        '-bookings.event.bookings',
    )

    @hybrid_property
    def password(self):
        raise AttributeError("Password is write-only.")

    @password.setter
    def password(self, plaintext):
        self.password_hash = bcrypt.generate_password_hash(plaintext).decode('utf-8')

    def authenticate(self, plaintext):
        return bcrypt.check_password_hash(self.password_hash, plaintext)

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(255))
    image_url = db.Column(db.String)
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)

    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    bookings = db.relationship('Booking', backref='event', cascade='all, delete-orphan')


    serialize_rules = (
        '-creator.password_hash',
        '-creator.bookings',
        '-bookings.event',
        '-bookings.user.bookings',
        'created_by',
        'creator.username'
    )

class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    
    serialize_rules = (
        '-user.password_hash',
        '-user.bookings',
        '-user.events',
        '-event.bookings',
        '-event.creator.bookings',
    )
