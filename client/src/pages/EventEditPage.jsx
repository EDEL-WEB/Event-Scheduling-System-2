import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EventEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [userId, setUserId] = useState(null);
  const [imageFile, setImageFile] = useState(null); // 📷 for image upload

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
    // No image validation here – optional
  });

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('location', values.location);
    formData.append('date', values.date);
    formData.append('start_time', values.start_time);
    formData.append('end_time', values.end_time);
    if (imageFile) {
      formData.append('image_file', imageFile); // 🖼️ new image if uploaded
    }

    fetch(`/events/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
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
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue }) => (
          <Form className="form" encType="multipart/form-data">
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
            <Field type="date" name="date" />
            <ErrorMessage name="date" component="div" className="error" />

            <label>Start Time</label>
            <Field type="time" name="start_time" />

            <label>End Time</label>
            <Field type="time" name="end_time" />

            <label>Upload New Image</label>
            <input
              type="file"
              name="image_file"
              accept="image/*"
              onChange={(e) => {
                setImageFile(e.currentTarget.files[0]);
              }}
            />

            {event.image_url && (
              <div>
                <p>Current Image:</p>
                <img
                  src={event.image_url.startsWith('http') ? event.image_url : `/uploads/${event.image_url}`}
                  alt={event.title}
                  style={{ width: '100%', maxWidth: '300px', marginTop: '10px' }}
                />
              </div>
            )}

            <button type="submit" className="btn-primary">💾 Update Event</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EventEditPage;
