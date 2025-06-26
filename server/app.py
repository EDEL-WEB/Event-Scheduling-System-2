from config import app, db, api
from models import User, Event, Booking

from controllers.user_controller import user_bp
from controllers.event_controller import event_bp
from controllers.booking_controller import booking_bp
from controllers.auth_controller import auth_bp

from flask import send_from_directory
import os

# Register blueprints
app.register_blueprint(user_bp, url_prefix="/users")
app.register_blueprint(event_bp, url_prefix="/events")
app.register_blueprint(booking_bp, url_prefix="/bookings")
app.register_blueprint(auth_bp, url_prefix="/auth")

# Serve static uploaded images
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Optional health check
@app.route("/")
def home():
    return {"message": "Event Scheduling API is running!"}, 200

# Start server
if __name__ == "__main__":
    app.run(port=5555, debug=True)
