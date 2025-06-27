Event Scheduling System

A full-stack web application built with **Flask (Python)** and **React (JavaScript)** that allows users to register, log in, create and manage events, and book events created by others. It supports light/dark themes and a styled user dashboard.

## Features
--User Authentication (Register, Login, Logout)
- Event Creation, Viewing, Editing, and Deletion
-  Event Booking System
-  Personalized User Dashboard
-  Light and Dark Theme Toggle
-  Responsive Design
## Technologies Used
---

## Features

-  User Authentication (Register, Login, Logout)
-  Event Creation, Viewing, Editing, and Deletion
-  Event Booking System
-  Personalized User Dashboard
-  Light and Dark Theme Toggle
-  Responsive Design
 Technologies Used

**Backend (Flask)**
- Flask
- Flask-RESTful
- SQLAlchemy
- PostgreSQL
- Flask-Migrate
- Bcrypt
- Faker (for seeding)

**Frontend (React)**
- React Router
- Fetch API
- Formik + Yup (for form handling and validation)
- CSS Modules + Themed Styles
- Context API for Theme Toggle

---

##  Setup Instructions

#Backend Setup (Flask API)


# 1. Clone the repository
git clone https://github.com/EDEL-WEB/Event-Scheduling-System-2.git

cd event-scheduler/server

# 2. Create virtual environment and activate
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
export FLASK_APP=app
export FLASK_ENV=development

# 5. Initialize database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# 6. (Optional) Seed data
python seed.py

# 7. Run server
flask run
 Frontend Setup (React App)

cd ../client

# 1. Install dependencies
npm install

# 2. Run frontend
npm start
 Authentication Flow
Users register via /auth/signup (creates a session)

Login via /auth/login (verifies password, sets session)

Protected routes require session (/auth/check_session)

Logout with /auth/logout (deletes session)

All session data is managed via cookies (credentials: include in fetch).

 API Endpoints
Auth Routes
Method	Endpoint	Description
POST	/auth/signup	Register new user
POST	/auth/login	Log in user
GET	/auth/check_session	Check session
DELETE	/auth/logout	Log out user

 Event Routes
Method	Endpoint	Description
GET	/events	List all events
GET	/events/:id	Get single event
POST	/events	Create event (auth required)
PATCH	/events/:id	Edit event
DELETE	/events/:id	Delete event

Booking Routes
Method	Endpoint	Description
GET	/bookings	List current user's bookings
POST	/bookings	Create new booking
DELETE	/bookings/:id	Cancel a booking

Testing with Postman
Import the provided Postman Collection from the docs/ folder.

Use {{base_url}} as http://localhost:5555


 Author
Edel Omondi
Built with ❤ using Flask + React
