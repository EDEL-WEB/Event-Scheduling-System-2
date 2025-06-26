from flask import request, session, jsonify, Blueprint, send_from_directory
from flask_restful import Api, Resource
from models import Event, User, db
from datetime import datetime
from werkzeug.utils import secure_filename
from config import app
import os

event_bp = Blueprint('events', __name__, url_prefix='/events')
api = Api(event_bp)

# Serve uploaded images

# Ensure the upload folder exists
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# GET all + POST new event
class EventList(Resource):
    def get(self):
        events = Event.query.all()
        return [e.to_dict() for e in events], 200

    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        data = request.form
        image_file = request.files.get("image")
        image_url = None

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(filepath)
            image_url = f"/uploads/{filename}"
        else:
            image_url = "https://via.placeholder.com/400x200.png?text=Event"

        try:
            event = Event(
                title=data["title"],
                description=data["description"],
                date=datetime.strptime(data["date"], "%Y-%m-%d"),
                location=data["location"],
                image_url=image_url,
                created_by=user_id
            )
            db.session.add(event)
            db.session.commit()
            return event.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400

# GET one, PATCH, DELETE
class EventDetail(Resource):
    def get(self, id):
        event = Event.query.get(id)
        if not event:
            return {"error": "Event not found"}, 404
        return event.to_dict(), 200

    def patch(self, id):
        user_id = session.get("user_id")
        event = Event.query.get(id)
        if not event or event.created_by != user_id:
            return {"error": "Unauthorized or not found"}, 403
        data = request.get_json()
        for field in ['title', 'description', 'date', 'location']:
            if field in data:
                setattr(event, field, data[field])
        db.session.commit()
        return event.to_dict(), 200

    def delete(self, id):
        user_id = session.get("user_id")
        event = Event.query.get(id)
        if not event or event.created_by != user_id:
            return {"error": "Unauthorized or not found"}, 403
        db.session.delete(event)
        db.session.commit()
        return {}, 204

# GET upcoming events
class UpcomingEvents(Resource):
    def get(self):
        today = datetime.now().date()
        events = Event.query.filter(Event.date >= today).all()
        return [e.to_dict() for e in events], 200

# GET attendees of an event
class EventAttendees(Resource):
    def get(self, id):
        event = Event.query.get(id)
        if not event:
            return {"error": "Event not found"}, 404
        attendees = [b.user.to_dict() for b in event.bookings]
        return attendees, 200

# GET by date range
class EventSearch(Resource):
    def get(self):
        start = request.args.get("start_date")
        end = request.args.get("end_date")
        if not start or not end:
            return {"error": "Start and end date required"}, 400
        start_date = datetime.strptime(start, "%Y-%m-%d")
        end_date = datetime.strptime(end, "%Y-%m-%d")
        events = Event.query.filter(Event.date >= start_date, Event.date <= end_date).all()
        return [e.to_dict() for e in events], 200

# Register routes
api.add_resource(EventList, '/')
api.add_resource(EventDetail, '/<int:id>')
api.add_resource(UpcomingEvents, '/upcoming')
api.add_resource(EventSearch, '/search')
api.add_resource(EventAttendees, '/<int:id>/attendees')
