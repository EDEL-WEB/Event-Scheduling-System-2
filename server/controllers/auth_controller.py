from flask import request, session, jsonify, Blueprint
from flask_restful import Resource, Api
from models import User, db
from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
api = Api(auth_bp)

# ------------------------------
# SIGNUP
# ------------------------------
class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return {"errors": ["Username, email, and password are required."]}, 422

        try:
            new_user = User(username=username, email=email)
            new_user.password = password

            db.session.add(new_user)
            db.session.commit()

            session["user_id"] = new_user.id

            return {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email
            }, 201

        except IntegrityError:
            db.session.rollback()
            return {"errors": ["Username or email already exists."]}, 422

# ------------------------------
# LOGIN
# ------------------------------
class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user = User.query.filter_by(username=username).first()
        if user and user.authenticate(password):
            session["user_id"] = user.id
            return {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }, 200

        return {"error": "Invalid username or password"}, 401

# ------------------------------
# LOGOUT
# ------------------------------
class Logout(Resource):
    def delete(self):
        if session.get("user_id"):
            session.pop("user_id")
            return {}, 204
        return {"error": "Not logged in"}, 401

# ------------------------------
# CHECK SESSION
# ------------------------------
class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id:
            user = User.query.get(user_id)
            if user:
                return {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }, 200
        return {"error": "Unauthorized"}, 401

# ------------------------------
# Register resources with API
# ------------------------------
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')
