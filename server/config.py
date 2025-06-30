import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, upgrade
from flask_restful import Api
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from sqlalchemy import MetaData
from dotenv import load_dotenv

# Load environment variables from .env (if needed)
load_dotenv()

# Flask app setup
app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///app.db")
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Secret key
app.secret_key = os.getenv("SECRET_KEY", "supersecret")

# ✅ Session cookie settings (important for login via browser)
app.config['SESSION_COOKIE_SECURE'] = False          # Allow HTTP
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'        # Allow sending cookies across sites

# ✅ Enable CORS for frontend origin (e.g. React dev server)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# File upload configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB max file size

# JSON formatting
app.json.compact = False

# Naming convention for Alembic compatibility
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s"
})

# Extensions initialization
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
api = Api(app)

# Initialize db
db.init_app(app)
