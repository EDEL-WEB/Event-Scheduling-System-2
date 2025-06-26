# server/seed.py

from faker import Faker
from config import app, db
from models import User, Event, Booking
import random
from datetime import datetime

fake = Faker()

with app.app_context():
    print(" Seeding data...")

    
    Booking.query.delete()
    Event.query.delete()
    User.query.delete()
    db.session.commit()

    
    users = []
    for i in range(5):
        user = User(
            username=f"user{i+1}",
            email=f"user{i+1}@example.com"
        )
        user.password = "password123"
        db.session.add(user)
        users.append(user)

    db.session.commit()

    
    static_events = [
    {
        "title": "React Conference",
        "description": "A conference about React and frontend development.",
        "location": "New York",
        "image_url": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": datetime(2025, 7, 10).date(),
        "start_time": datetime(2025, 7, 10, 9, 0).time(),
        "end_time": datetime(2025, 7, 10, 17, 0).time(),
    },
    {
        "title": "Community Health Fair",
        "description": "Free health screenings and wellness activities for all.",
        "location": "Nairobi",
        "image_url": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": datetime(2025, 7, 12).date(),
        "start_time": datetime(2025, 7, 12, 10, 0).time(),
        "end_time": datetime(2025, 7, 12, 16, 0).time(),
    },
    {
        "title": "Inter-School Science Expo",
        "description": "Showcasing student science and innovation projects.",
        "location": "Mombasa",
        "image_url": "/uploads/interschool_science_expo.jpg",

        "date": datetime(2025, 7, 15).date(),
        "start_time": datetime(2025, 7, 15, 8, 30).time(),
        "end_time": datetime(2025, 7, 15, 15, 0).time(),
    },
    {
        "title": "Sunday Youth Service",
        "description": "Join us for worship, word, and fellowship.",
        "location": "Kisumu",
        "image_url": "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": datetime(2025, 7, 20).date(),
        "start_time": datetime(2025, 7, 20, 10, 0).time(),
        "end_time": datetime(2025, 7, 20, 12, 30).time(),
    },
    {
        "title": "City Marathon",
        "description": "Annual half-marathon through city streets.",
        "location": "Eldoret",
        "image_url": "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": datetime(2025, 8, 1).date(),
        "start_time": datetime(2025, 8, 1, 6, 0).time(),
        "end_time": datetime(2025, 8, 1, 12, 0).time(),
    },
    {
        "title": "AI in Healthcare Summit",
        "description": "How artificial intelligence is transforming medicine.",
        "location": "Boston",
        "image_url": "/uploads/ai_health.jpg",
        "date": datetime(2025, 8, 10).date(),
        "start_time": datetime(2025, 8, 10, 9, 0).time(),
        "end_time": datetime(2025, 8, 10, 16, 0).time(),
    },
    {
        "title": "Worship Night",
        "description": "An evening of praise, worship, and prayer.",
        "location": "Machakos",
        "image_url": "https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": datetime(2025, 8, 20).date(),
        "start_time": datetime(2025, 8, 20, 18, 30).time(),
        "end_time": datetime(2025, 8, 20, 21, 0).time(),
    },
    {
        "title": "Startup Pitch Day",
        "description": "Pitch your ideas to real investors.",
        "location": "Nairobi",
        "image_url": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": datetime(2025, 8, 25).date(),
        "start_time": datetime(2025, 8, 25, 14, 0).time(),
        "end_time": datetime(2025, 8, 25, 17, 0).time(),
    },
    {
        "title": "Teachers' Workshop",
        "description": "Training and resources for modern educators.",
        "location": "Kericho",
        "image_url": "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": datetime(2025, 9, 5).date(),
        "start_time": datetime(2025, 9, 5, 9, 0).time(),
        "end_time": datetime(2025, 9, 5, 15, 0).time(),
    },
    {
        "title": "Youth Football Camp",
        "description": "Train with professional coaches in a week-long camp.",
        "location": "Kakamega",
        "image_url": "https://images.unsplash.com/photo-1533236897111-3e94666b2edf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "date": datetime(2025, 9, 10).date(),
        "start_time": datetime(2025, 9, 10, 8, 0).time(),
        "end_time": datetime(2025, 9, 10, 17, 0).time(),
    }
]

    events = []
    for i, event_data in enumerate(static_events):
        creator = users[i % len(users)]
        event = Event(
            title=event_data["title"],
            description=event_data["description"],
            location=event_data["location"],
            image_url=event_data["image_url"],
            date=event_data["date"],
            start_time=event_data["start_time"],
            end_time=event_data["end_time"],
            created_by=creator.id
        )
        db.session.add(event)
        events.append(event)

    db.session.commit()

    
    for _ in range(5):
        booking = Booking(
            user_id=random.choice(users).id,
            event_id=random.choice(events).id
        )
        db.session.add(booking)

    db.session.commit()

    print(" Done seeding!")
