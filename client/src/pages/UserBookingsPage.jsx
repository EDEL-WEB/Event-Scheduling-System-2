import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/auth/check_session', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(user => {
        setUserId(user.id);
        return fetch(`/users/${user.id}`);
      })
      .then(res => {
        if (!res.ok) throw new Error('User not found');
        return res.json();
      })
      .then(userData => {
        setBookings(userData.bookings || []);
        setLoading(false);
      })
      .catch(() => {
        setBookings([]);
        setLoading(false);
      });
  }, []);

  const handleCancelBooking = (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    fetch(`/bookings/${bookingId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to cancel booking');
        
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      })
      .catch(err => alert(err.message));
  };

  if (loading) return <p>Loading your bookings...</p>;
  if (!bookings.length) return <p>You have no bookings yet.</p>;

  return (
    <div className="dashboard-container">
      <h2>Your Bookings</h2>
      <ul className="event-list">
        {bookings.map((booking) => {
          const event = booking.event;
          const isCreator = userId === event.created_by;


          return (
            <li key={booking.id} className="event-card">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
              <p> <strong>{event.location}</strong></p>
              <p> <strong>{event.date}</strong></p>
              <p>Booked at: {new Date(booking.created_at).toLocaleString()}</p>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                {/*  Edit only if user is creator */}
                {isCreator && (
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/events/${event.id}/edit`)}
                  >
                     Edit Event
                  </button>
                )}

                {/*  Cancel Booking button */}
                <button
                  className="btn-cancel"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                   Cancel Booking
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserBookingsPage;
