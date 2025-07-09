import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Poll for token changes every 500ms
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkToken(); // Run immediately
    const interval = setInterval(checkToken, 500);

    return () => clearInterval(interval); // Cleanup
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Close menu on resize
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">Mutual Fund App</div>

        <button
          className={`navbar-toggle${menuOpen ? " open" : ""}`}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <div className={`navbar-links${menuOpen ? " show" : ""}`}>
          <div className="navbar-group">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/add-fund" onClick={() => setMenuOpen(false)}>
              Add Fund
            </Link>
          </div>
          <div className="navbar-group">
            <Link to="/saved" onClick={() => setMenuOpen(false)}>
              Saved Funds
            </Link>
            {!isLoggedIn && (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
          <div className="navbar-group">
            {!isLoggedIn ? (
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
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
      </div>
    </nav>
  );
}

export default Navbar;
