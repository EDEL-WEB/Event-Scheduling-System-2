import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = (values, { resetForm }) => {
    fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      credentials: 'include' // ✅ important for session cookies
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Login failed");
        }
        return res.json();
      })
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          setIsAuthenticated(true); // ✅ set auth state
          resetForm();
          navigate('/dashboard');  // ✅ redirect
        }
      })
      .catch(err => {
        alert('Invalid credentials or server error');
        console.error(err);
      });
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form>
          <label>Username</label>
          <Field name="username" type="text" />
          <ErrorMessage name="username" component="div" className="error" />

          <label>Password</label>
          <Field name="password" type="password" />
          <ErrorMessage name="password" component="div" className="error" />

          <button type="submit">Login</button>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginPage;
