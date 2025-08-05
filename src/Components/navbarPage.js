import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './../Components/css/navbar.css';

export const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
    setExpanded(false);
  };

  useEffect(() => {
    setExpanded(false);
  }, [location]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/upload">
          <i className="bi bi-files me-2"></i>
          DocManager
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            {token && (
              <>

                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
                    to="/upload"
                  >
                    <i className="bi bi-cloud-arrow-up me-1"></i>
                    Upload
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
                    to="/search"
                  >
                    <i className="bi bi-search me-1"></i>
                    Search
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                    to="/admin"
                  >
                    <i className="bi bi-shield-lock me-1"></i>
                    Admin
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex">
            {token ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={
                    handleLogout
                  }
                >
                  <i className="bi bi-person-circle me-1"></i>
                  Log Out
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-light">
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};