import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EventCreatePage = () => {
  const initialValues = {
    title: '',
    description: '',
    location: '',
    date: '',
    start_time: '',
    end_time: '',
    image: null // new: holds the file
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    location: Yup.string().required('Location is required'),
    date: Yup.date().required('Date is required'),
    start_time: Yup.string().matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
    end_time: Yup.string().matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format'),
    image: Yup.mixed().required('Image is required')
  });

  const handleSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('location', values.location);
    formData.append('date', values.date);
    formData.append('start_time', values.start_time || '');
    formData.append('end_time', values.end_time || '');
    formData.append('image', values.image);

    fetch('/events/', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('🎉 Event created successfully!');
          resetForm();
        }
      })
      .catch(err => alert('Something went wrong: ' + err.message));
  };

  return (
    <div className="form-container">
      <h2>Create Event</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form encType="multipart/form-data">
            <label>Title</label>
            <Field name="title" type="text" />
            <ErrorMessage name="title" component="div" className="error" />

            <label>Description</label>
            <Field name="description" as="textarea" />
            <ErrorMessage name="description" component="div" className="error" />

            <label>Location</label>
            <Field name="location" type="text" />
            <ErrorMessage name="location" component="div" className="error" />

            <label>Date</label>
            <Field name="date" type="date" />
            <ErrorMessage name="date" component="div" className="error" />

            <label>Start Time (HH:MM)</label>
            <Field name="start_time" type="time" />
            <ErrorMessage name="start_time" component="div" className="error" />

            <label>End Time (HH:MM)</label>
            <Field name="end_time" type="time" />
            <ErrorMessage name="end_time" component="div" className="error" />

            <label>Upload Event Image</label>
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => setFieldValue('image', e.currentTarget.files[0])}
            />
            <ErrorMessage name="image" component="div" className="error" />

            <button type="submit">Create Event</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EventCreatePage;
