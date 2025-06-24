# server/seed.py

from faker import Faker
from config import app, db
from models import User, Event, Booking
import random
from datetime import datetime, timedelta

fake = Faker()

with app.app_context():
    print("🌱 Seeding data...")

    # Clear old data
    Booking.query.delete()
    Event.query.delete()
    User.query.delete()

    db.session.commit()

    # Seed users
    users = []
    for _ in range(5):
        user = User(
            username=fake.user_name(),
            email=fake.email()
        )
        user.password = "password123"
        db.session.add(user)
        users.append(user)

    db.session.commit()

    # Seed events
    events = []
    for _ in range(10):
        creator = random.choice(users)
        event = Event(
            title=fake.catch_phrase(),
            description=fake.text(max_nb_chars=200),
            location=fake.city(),
            image_url=fake.image_url(),
            date=fake.date_between(start_date='today', end_date='+30d'),
            start_time=(datetime.now() + timedelta(hours=random.randint(1, 3))).time(),
            end_time=(datetime.now() + timedelta(hours=random.randint(4, 6))).time(),
            created_by=creator.id
        )
        db.session.add(event)
        events.append(event)

    db.session.commit()

    # Seed bookings
    for _ in range(15):
        booking = Booking(
            user_id=random.choice(users).id,
            event_id=random.choice(events).id
        )
        db.session.add(booking)

    db.session.commit()

    print("✅ Done seeding!")
