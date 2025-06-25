function EventCard({ event }) {
  return (
    <div className="event-card">
      <img src={event.image_url} alt={event.title} className="event-image" />
      <div className="event-details">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Date:</strong> {event.date}</p>
      </div>
    </div>
  );
}

export default EventCard;
