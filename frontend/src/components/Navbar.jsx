import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    setIsLoggedIn(
      Boolean(localStorage.getItem("token"))
    );
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("rememberMe");

    setIsLoggedIn(false);

    navigate("/");
  };

  return (
    <header className="navbar">

      {/* LOGO */}
      <Link
        to={isLoggedIn ? "/dashboard" : "/"}
        className="nav-brand"
      >
        <div className="nav-logo">
          AI
        </div>

        <div className="nav-brand-text">
          <span className="brand-title">
            AI Teacher
          </span>

          <span className="brand-subtitle">
            SMART LEARNING
          </span>
        </div>
      </Link>


      {/* NAVIGATION */}
      {isLoggedIn && (
        <nav className="nav-menu">

          <Link
            to="/dashboard"
            className={
              location.pathname === "/dashboard"
                ? "active"
                : ""
            }
          >
            Home
          </Link>


          <Link
            to="/study"
            className={
              location.pathname === "/study"
                ? "active"
                : ""
            }
          >
            Study
          </Link>


          <Link
            to="/ai-teacher"
            className={
              location.pathname === "/ai-teacher"
                ? "active"
                : ""
            }
          >
            AI Teacher
          </Link>


          <Link
            to="/my-learning"
            className={
              location.pathname === "/my-learning"
                ? "active"
                : ""
            }
          >
            My Learning
          </Link>


          <Link
            to="/exams"
            className={
              location.pathname === "/exams"
                ? "active"
                : ""
            }
          >
            Exams
          </Link>


          <Link
            to="/profile"
            className={
              location.pathname === "/profile"
                ? "active"
                : ""
            }
          >
            Profile
          </Link>

        </nav>
      )}


      {/* ACTION BUTTONS */}
      <div className="nav-actions">

        {isLoggedIn ? (

          <button
            className="nav-start"
            onClick={handleLogout}
          >
            Logout
          </button>

        ) : (

          <>
            <button
              className="nav-login"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="nav-start"
              onClick={() => navigate("/login")}
            >
              Get Started →
            </button>
          </>

        )}

      </div>

    </header>
  );
}

export default Navbar;