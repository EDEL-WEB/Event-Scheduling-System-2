import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext'; // Adjust path if needed
import '../App.css';

const UserDashboardPage = () => {
  const { theme } = useContext(ThemeContext); // 👈 grabs dark/light
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/auth/check_session', { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject('Not authenticated'))
      .then(data => setUser(data))
      .catch(() => navigate('/login'));
  }, []);

  const handleLogout = () => {
    fetch('/auth/logout', { method: 'DELETE', credentials: 'include' })
      .then(() => {
        setUser(null);
        navigate('/login');
      });
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      fetch(`/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      }).then(res => {
        if (res.ok) {
          setUser(prev => ({
            ...prev,
            events: prev.events.filter(e => e.id !== eventId),
          }));
        } else {
          alert('Failed to delete event.');
        }
      });
    }
  };

  if (!user) return null;

  const { username, email, events = [], bookings = [] } = user;

  return (
    <div className={`dashboard-container ${theme}`}>
      <div className="header-top">
        <h2>👋 Welcome, {username}!</h2>
        <p>{email}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{events.length}</h3>
          <p>My Events</p>
        </div>
        <div className="stat-card">
          <h3>{bookings.length}</h3>
          <p>My Bookings</p>
        </div>
      </div>

      <section className="dashboard-section">
        <h3>📅 My Events</h3>
        {events.length === 0 ? (
          <div className="empty-state">
            <p>You haven’t created any events yet.</p>
          </div>
        ) : (
          <div className="card-grid">
            {events.map(event => (
              <div className="event-card" key={event.id}>
                <h4><Link to={`/events/${event.id}`}>{event.title}</Link></h4>
                <p className="event-date">{event.date}</p>
                <p>{event.description}</p>
                <div className="card-actions">
                  <Link to={`/events/${event.id}/edit`}>
                    <button className="btn edit-btn">✏️ Edit</button>
                  </Link>
                  <button className="btn delete-btn" onClick={() => handleDelete(event.id)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h3>🎟️ My Bookings</h3>
        {bookings.length === 0 ? (
          <div className="empty-state">
            <p>You haven’t booked any events yet.</p>
          </div>
        ) : (
          <div className="card-grid">
            {bookings.map(booking => (
              <div className="event-card" key={booking.id}>
                <h4><Link to={`/events/${booking.event?.id}`}>{booking.event?.title}</Link></h4>
                <p className="event-date">{booking.event?.date}</p>
                <p>{booking.event?.description}</p>
                <span className="status-tag">{booking.status || 'Booked'}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboardPage;
