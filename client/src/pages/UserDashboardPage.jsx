import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/auth/check_session', { credentials: 'include' })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      fetch(`/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then((res) => {
          if (res.ok) {
            
            setUser((prev) => ({
              ...prev,
              events: prev.events.filter((e) => e.id !== eventId),
            }));
          } else {
            alert('Failed to delete event.');
          }
        });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to view your dashboard.</p>;

  const userEvents = user.events || [];
  const userBookings = user.bookings || [];

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.username} </h2>
      <p>Email: {user.email}</p>

      <section className="dashboard-section">
        <h3>Your Events</h3>
        {userEvents.length === 0 ? (
          <p>You haven’t created any events yet.</p>
        ) : (
          <ul className="event-list">
            {userEvents.map((event) => (
              <li key={event.id} className="event-card">
                <Link to={`/events/${event.id}`}>
                  <h4>{event.title}</h4>
                </Link>
                <p>{event.description}</p>
                <small>{event.date}</small>

                <div style={{ marginTop: '10px' }}>
                  <Link to={`/events/${event.id}/edit`}>
                    <button style={{ marginRight: '10px' }}>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(event.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dashboard-section">
        <h3>Your Bookings</h3>
        {userBookings.length === 0 ? (
          <p>You haven’t booked any events yet.</p>
        ) : (
          <ul className="event-list">
            {userBookings.map((booking) => (
              <li key={booking.id} className="event-card">
                <Link to={`/events/${booking.event?.id}`}>
                  <h4>{booking.event?.title}</h4>
                </Link>
                <p>{booking.event?.description}</p>
                <small>{booking.event?.date}</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default UserDashboardPage;
