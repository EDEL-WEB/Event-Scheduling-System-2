import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "../App.css";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    fetch("/auth/check_session", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser);
  }, []);

  const handleLogout = () => {
    fetch("/auth/logout", {
      method: "DELETE",
      credentials: "include",
    }).then(() => {
      setUser(null);
      navigate("/login");
    });
  };

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-header">
        <h2 className="logo">EventApp</h2>
        <button className="toggle-button" onClick={toggleMenu}>☰</button>
      </div>

      <div className={`navbar-links ${isOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>

        {user ? (
          <>
            <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link to="/bookings" onClick={() => setIsOpen(false)}>My Bookings</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
          </>
        )}

        {/* 🌙 Theme Toggle */}
        <button className="btn theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
