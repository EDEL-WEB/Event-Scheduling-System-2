// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    fetch("/auth/check_session", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  
  useEffect(() => {
    fetch("http://localhost:5555/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  const handleBook = (eventId) => {
    if (!user) {
      alert("You must be logged in to book.");
      navigate("/login");
      return;
    }

    fetch("/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ event_id: eventId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) alert(data.error);
        else alert("Booking successful!");
      })
      .catch(() => alert("Booking failed."));
  };

  return (
    <div>
      <div className="homepage-header">
        {user ? (
          <>
            <Link to="/create-event" className="btn">+ Create Event</Link>
            <Link to="/dashboard" className="btn">My Dashboard</Link>
          </>
        ) : (
          <p className="login-reminder">
            Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to book events.
          </p>
        )}
      </div>

      <div className="event-list">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <img
              src={
                event.image_url?.startsWith("http") || event.image_url?.startsWith("/uploads/")
                  ? event.image_url
                  : `/uploads/${event.image_url || "fallback.jpg"}`
              }
              alt={event.title}
              className="event-image"
            />

            <div className="event-details">
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p>{event.description}</p>

              <div className="card-buttons">
                <Link to={`/events/${event.id}`} className="btn btn-detail">View Details</Link>
                {user && (
                  <button className="btn btn-book" onClick={() => handleBook(event.id)}>Book Now</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
