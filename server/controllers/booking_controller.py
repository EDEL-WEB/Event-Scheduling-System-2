from flask import request, session, jsonify, Blueprint
from flask_restful import Api, Resource
from models import Booking, Event, User, db

booking_bp = Blueprint('bookings', __name__, url_prefix='/bookings')
api = Api(booking_bp)


class BookingList(Resource):
    def get(self):
        bookings = Booking.query.all()
        return [b.to_dict() for b in bookings], 200

    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        data = request.get_json()
        event_id = data.get("event_id")
        if not Event.query.get(event_id):
            return {"error": "Event does not exist"}, 404

        existing = Booking.query.filter_by(user_id=user_id, event_id=event_id).first()
        if existing:
            return {"error": "Already booked"}, 400

        booking = Booking(user_id=user_id, event_id=event_id)
        db.session.add(booking)
        db.session.commit()
        return booking.to_dict(), 201


class UserBookings(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404
        return [b.to_dict() for b in user.bookings], 200
    
class BookingDetail(Resource):
    def delete(self, id):
        user_id = session.get("user_id")
        booking = Booking.query.get(id)
        if not booking or booking.user_id != user_id:
            return {"error": "Unauthorized or not found"}, 403
        db.session.delete(booking)
        db.session.commit()
        return {}, 204


api.add_resource(BookingList, '/')
api.add_resource(UserBookings, '/user/<int:user_id>')
api.add_resource(BookingDetail, '/<int:id>')
