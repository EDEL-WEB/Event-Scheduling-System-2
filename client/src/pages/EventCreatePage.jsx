import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EventCreatePage = () => {
  const initialValues = {
    title: '',
    description: '',
    location: '',
    image_url: '',
    date: '',
    start_time: '',
    end_time: ''
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    location: Yup.string().required('Location is required'),
    image_url: Yup.string().url('Invalid URL').required('Image URL is required'),
    date: Yup.date().required('Date is required'),
    start_time: Yup.string().matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
    end_time: Yup.string().matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format')
  });

  const handleSubmit = (values, { resetForm }) => {
    fetch('/events/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Event created successfully!');
          resetForm();
        }
      });
  };

  return (
    <div className="form-container">
      <h2>Create Event</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form>
          <label>Title</label>
          <Field name="title" type="text" />
          <ErrorMessage name="title" component="div" className="error" />

          <label>Description</label>
          <Field name="description" as="textarea" />
          <ErrorMessage name="description" component="div" className="error" />

          <label>Location</label>
          <Field name="location" type="text" />
          <ErrorMessage name="location" component="div" className="error" />

          <label>Image URL</label>
          <Field name="image_url" type="url" />
          <ErrorMessage name="image_url" component="div" className="error" />

          <label>Date</label>
          <Field name="date" type="date" />
          <ErrorMessage name="date" component="div" className="error" />

          <label>Start Time (HH:MM)</label>
          <Field name="start_time" type="time" />
          <ErrorMessage name="start_time" component="div" className="error" />

          <label>End Time (HH:MM)</label>
          <Field name="end_time" type="time" />
          <ErrorMessage name="end_time" component="div" className="error" />

          <button type="submit">Create Event</button>
        </Form>
      </Formik>
    </div>
  );
};

export default EventCreatePage;
