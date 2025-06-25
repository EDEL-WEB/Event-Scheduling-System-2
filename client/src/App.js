import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventDetailPage from './pages/EventDetailPage';
import UserDashboardPage from './pages/UserDashboardPage';
import EventCreatePage from './pages/EventCreatePage';
import EventEditPage from './pages/EventEditPage';
import UserBookingsPage from './pages/UserBookingsPage';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/auth/check_session', {
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  return (
    <Router>
      <NavBar />

      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />

          {/* 🔐 Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <EventCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <EventEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserBookingsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
