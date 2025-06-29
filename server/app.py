# server/app.py

from config import app, db, api
from models import User, Event, Booking

from controllers.user_controller import user_bp
from controllers.event_controller import event_bp
from controllers.booking_controller import booking_bp
from controllers.auth_controller import auth_bp

from flask import send_from_directory
from flask_migrate import upgrade
import os


app.register_blueprint(user_bp, url_prefix="/users")
app.register_blueprint(event_bp, url_prefix="/events")
app.register_blueprint(booking_bp, url_prefix="/bookings")
app.register_blueprint(auth_bp, url_prefix="/auth")


@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/api")
def api_status():
    return {"message": " Event Scheduling API is running!"}, 200


@app.route('/static/<path:path>')
def serve_static(path):
    static_dir = os.path.join(os.path.dirname(__file__), '..', 'client', 'build', 'static')
    return send_from_directory(static_dir, path)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    build_dir = os.path.join(os.path.dirname(__file__), '..', 'client', 'build')
    file_path = os.path.join(build_dir, path)
    if path and os.path.exists(file_path):
        return send_from_directory(build_dir, path)
    return send_from_directory(build_dir, 'index.html')


# Run Flask app
if __name__ == "__main__":
    app.run(port=5555, debug=True)
