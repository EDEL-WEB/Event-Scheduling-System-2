import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegisterPage = () => {
  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be 6 characters').required('Password is required'),
  });

  const handleSubmit = (values, { resetForm }) => {
    fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then(res => res.json())
      .then(data => {
        alert('Registration Successful!');
        resetForm();
      });
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form>
          <label>Username</label>
          <Field name="username" type="text" />
          <ErrorMessage name="username" component="div" className="error" />

          <label>Email</label>
          <Field name="email" type="email" />
          <ErrorMessage name="email" component="div" className="error" />

          <label>Password</label>
          <Field name="password" type="password" />
          <ErrorMessage name="password" component="div" className="error" />

          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
};

export default RegisterPage;
