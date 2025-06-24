# server/app.py

from config import app, db, api  # Core extensions and app from config
from models import User, Event, Booking  # Import models for migrations
# Register Blueprints
from controllers.user_controller import user_bp
from controllers.event_controller import event_bp
from controllers.booking_controller import booking_bp
from controllers.auth_controller import auth_bp

# Register the blueprints to the app
app.register_blueprint(user_bp, url_prefix="/users")
app.register_blueprint(event_bp, url_prefix="/events")
app.register_blueprint(booking_bp, url_prefix="/bookings")
app.register_blueprint(auth_bp, url_prefix="/auth")  # ✅ Add this


# Optional root route to confirm server is running
@app.route("/")
def home():
    return {"message": "Event Scheduling API is running!"}, 200

# Run the server
if __name__ == "__main__":
    app.run(port=5555, debug=True)
