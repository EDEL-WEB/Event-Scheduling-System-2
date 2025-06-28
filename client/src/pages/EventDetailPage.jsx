import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css'; 

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [userId, setUserId] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  
    fetch(`/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error("Event not found", err));

    
    fetch('/auth/check_session', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((user) => setUserId(user.id))
      .catch(() => setUserId(null));
  }, [id]);

  const handleBooking = () => {
    if (!userId) {
      alert("Please login first to book this event.");
      return navigate('/login');
    }

    fetch('/bookings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ event_id: parseInt(id) }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Booking failed');
        return res.json();
      })
      .then(() => setBookingSuccess(true))
      .catch((err) => {
        alert("Could not book event.");
        console.error(err);
      });
  };

  if (!event) return <p>Loading event details...</p>;

  return (
    <div className="dashboard-container">
      <h2>{event.title}</h2>

      <img
        src={
          event.image_url?.startsWith("http") || event.image_url?.startsWith("/uploads/")
            ? event.image_url
            : `/uploads/${event.image_url || 'fallback.jpg'}`
        }
        alt={event.title}
        style={{ width: '100%', maxWidth: '600px', marginBottom: '1rem' }}
      />

      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p>
        <strong>Start Time:</strong> {event.start_time || 'TBD'}<br />
        <strong>End Time:</strong> {event.end_time || 'TBD'}
      </p>
      <p><strong>Created by:</strong> {event.creator?.username || 'Unknown'}</p>

      {!bookingSuccess ? (
        <button onClick={handleBooking} className="btn-primary">
          Book This Event
        </button>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <p className="success">🎉 Booking confirmed!</p>
          <button
            onClick={() => navigate('/bookings')}
            className="btn-bookings"
          >
            Go to My Bookings
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
