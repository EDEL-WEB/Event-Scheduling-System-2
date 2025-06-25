import React, { useEffect, useState } from 'react';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/auth/check_session', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((user) => {
        return fetch(`/users/${user.id}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error('User not found');
        return res.json();
      })
      .then((userData) => {
        setBookings(userData.bookings || []);
        setLoading(false);
      })
      .catch(() => {
        setBookings([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading your bookings...</p>;
  if (!bookings.length) return <p>You have no bookings yet.</p>;

  return (
    <div className="dashboard-container">
      <h2>Your Bookings</h2>
      <ul className="event-list">
        {bookings.map((booking) => (
          <li key={booking.id} className="event-card">
            <h4>{booking.event.title}</h4>
            <p>{booking.event.description}</p>
            <p>
              📍 <strong>{booking.event.location}</strong>
            </p>
            <p>
              📅 <strong>{booking.event.date}</strong>
            </p>
            <p>Booked at: {new Date(booking.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserBookingsPage;
