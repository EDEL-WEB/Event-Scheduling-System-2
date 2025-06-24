from flask import request, session, jsonify, Blueprint
from flask_restful import Api, Resource
from models import Event, User, db
from datetime import datetime

event_bp = Blueprint('events', __name__, url_prefix='/events')
api = Api(event_bp)

# GET all + POST new event
class EventList(Resource):
    def get(self):
        events = Event.query.all()
        return [e.to_dict() for e in events], 200

    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        data = request.get_json()
        try:
            event = Event(
                title=data["title"],
                description=data["description"],
                date=datetime.strptime(data["date"], "%Y-%m-%d"),
                location=data["location"],
                image_url=data.get("image_url") or "https://via.placeholder.com/400x200.png?text=Event",
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
