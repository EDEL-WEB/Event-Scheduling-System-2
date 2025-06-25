import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EventEditPage = () => {
  const { id } = useParams(); // Event ID from route
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch(`/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error('Event fetch failed', err));

    fetch('/auth/check_session', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((user) => setUserId(user.id))
      .catch(() => setUserId(null));
  }, [id]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    location: Yup.string().required('Location is required'),
    date: Yup.date().required('Date is required'),
    start_time: Yup.string(),
    end_time: Yup.string(),
    image_url: Yup.string().url('Must be a valid URL'),
  });

  const handleSubmit = (values) => {
    fetch(`/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      })
      .then(() => {
        alert('Event updated!');
        navigate(`/events/${id}`);
      })
      .catch((err) => {
        alert('Update failed.');
        console.error(err);
      });
  };

  if (!event) return <p>Loading...</p>;
  if (userId !== event.created_by) return <p>You are not authorized to edit this event.</p>;

  return (
    <div className="dashboard-container">
      <h2>Edit Event</h2>
      <Formik
        initialValues={{
          title: event.title,
          description: event.description,
          location: event.location,
          date: event.date,
          start_time: event.start_time || '',
          end_time: event.end_time || '',
          image_url: event.image_url || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form className="form">
          <label>Title</label>
          <Field name="title" />
          <ErrorMessage name="title" component="div" className="error" />

          <label>Description</label>
          <Field as="textarea" name="description" />
          <ErrorMessage name="description" component="div" className="error" />

          <label>Location</label>
          <Field name="location" />
          <ErrorMessage name="location" component="div" className="error" />

          <label>Date</label>
          <Field name="date" type="date" />
          <ErrorMessage name="date" component="div" className="error" />

          <label>Start Time</label>
          <Field name="start_time" type="time" />

          <label>End Time</label>
          <Field name="end_time" type="time" />

          <label>Image URL</label>
          <Field name="image_url" />
          <ErrorMessage name="image_url" component="div" className="error" />

          <button type="submit" className="btn-primary">Update Event</button>
        </Form>
      </Formik>
    </div>
  );
};

export default EventEditPage;
