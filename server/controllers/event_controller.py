from flask import request, session, jsonify, Blueprint, send_from_directory
from flask_restful import Api, Resource
from models import Event, User, db
from datetime import datetime
from werkzeug.utils import secure_filename
from config import app
import os

event_bp = Blueprint('events', __name__, url_prefix='/events')
api = Api(event_bp)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@event_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


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
                start_time=data.get("start_time"),
                end_time=data.get("end_time"),
                image_url=image_url,
                created_by=user_id
            )
            db.session.add(event)
            db.session.commit()
            return event.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400


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

        data = request.form
        image_file = request.files.get("image_file")

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(filepath)
            event.image_url = filename

        for field in ['title', 'description', 'location', 'start_time', 'end_time']:
            if field in data:
                setattr(event, field, data[field])

        if 'date' in data:
            try:
                event.date = datetime.strptime(data['date'], "%Y-%m-%d")
            except ValueError:
                return {"error": "Invalid date format. Use YYYY-MM-DD."}, 400

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


class UpcomingEvents(Resource):
    def get(self):
        today = datetime.now().date()
        events = Event.query.filter(Event.date >= today).all()
        return [e.to_dict() for e in events], 200


class EventSearch(Resource):
    def get(self):
        start = request.args.get("start_date")
        end = request.args.get("end_date")

        if not start or not end:
            return {"error": "Start and end date required"}, 400

        try:
            start_date = datetime.strptime(start, "%Y-%m-%d")
            end_date = datetime.strptime(end, "%Y-%m-%d")
        except ValueError:
            return {"error": "Invalid date format. Use YYYY-MM-DD"}, 400

        events = Event.query.filter(Event.date >= start_date, Event.date <= end_date).all()
        return [e.to_dict() for e in events], 200


class EventAttendees(Resource):
    def get(self, id):
        event = Event.query.get(id)
        if not event:
            return {"error": "Event not found"}, 404
        attendees = [b.user.to_dict() for b in event.bookings]
        return attendees, 200


api.add_resource(EventList, '/')
api.add_resource(EventDetail, '/<int:id>')
api.add_resource(UpcomingEvents, '/upcoming')
api.add_resource(EventSearch, '/search')
api.add_resource(EventAttendees, '/<int:id>/attendees')
