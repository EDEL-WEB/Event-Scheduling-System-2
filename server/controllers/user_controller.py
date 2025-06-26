from flask import Blueprint, request, jsonify, session
from models import User, db

user_bp = Blueprint('user_bp', __name__, url_prefix='/users')


@user_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


@user_bp.route('/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200


@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    if not all(field in data for field in ["username", "email", "password"]):
        return jsonify({"error": "Missing fields"}), 400

    if User.query.filter((User.username == data["username"]) | (User.email == data["email"])).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(username=data["username"], email=data["email"])
    new_user.password = data["password"]

    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.to_dict()), 201


@user_bp.route('/<int:id>', methods=['PATCH'])
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    for field in ["username", "email"]:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    return jsonify(user.to_dict()), 200


@user_bp.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return {}, 204


@user_bp.route('/me', methods=['GET'])
def current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200
