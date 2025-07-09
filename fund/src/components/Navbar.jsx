import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check for token every 500ms
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkToken(); // Initial check
    const interval = setInterval(checkToken, 500);
    return () => clearInterval(interval);
  }, []);

  // Close menu on resize
  useEffect(() => {
    if (!menuOpen) return;
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Mutual Fund App</div>

      <button
        className={`navbar-toggle${menuOpen ? " open" : ""}`}
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <div className={`navbar-links${menuOpen ? " show" : ""}`}>
        {/* First group: navigation */}
        <div className="navbar-group">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/add-fund" onClick={() => setMenuOpen(false)}>Add Fund</Link>
          <Link to="/search" onClick={() => setMenuOpen(false)}>Search</Link>
        </div>

        {/* Second group: saved and fund details */}
        <div className="navbar-group">
          <Link to="/saved" onClick={() => setMenuOpen(false)}>Saved Funds</Link>
          <Link to="/fund-details" onClick={() => setMenuOpen(false)}>Fund Details</Link>
          {!isLoggedIn && (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>

        {/* Third group: register or logout */}
        <div className="navbar-group">
          {!isLoggedIn ? (
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
          ) : (
            <button
              className="logout-button"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
