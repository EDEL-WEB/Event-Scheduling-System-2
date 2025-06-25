# server/config.py

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from sqlalchemy import MetaData
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# App instance
app = Flask(__name__)

# Config settings
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI", "sqlite:///app.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.getenv("SECRET_KEY", "supersecret")
# File upload settings
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # Optional: 2MB limit


# Pretty JSON
app.json.compact = False

# Naming convention for Alembic
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s"
})

# Initialize extensions
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
api = Api(app)
# Replace this:
# CORS(app)

# With this:
CORS(app, supports_credentials=True)


# Initialize db with app
db.init_app(app)
