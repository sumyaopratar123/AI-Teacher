import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password!");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      // Get all users
      const savedUsers = localStorage.getItem("aiTeacherUsers");

      const users = savedUsers
        ? JSON.parse(savedUsers)
        : {};

      // NEW USER
      if (!users[cleanEmail]) {
        users[cleanEmail] = {
          password: password,

          profile: {
            name: "",
            email: cleanEmail,
            bio: "Passionate learner exploring Artificial Intelligence and technology.",
            university: "Student",
            language: "English",
          },

          learning: {
            courses: [],
            completedLessons: [],
            progress: 0,
            learningTime: 0,
            streak: 0,
          },

          exams: [],

          createdAt: new Date().toISOString(),
        };

        localStorage.setItem(
          "aiTeacherUsers",
          JSON.stringify(users)
        );
      }

      // EXISTING USER
      else {
        if (users[cleanEmail].password !== password) {
          alert("Incorrect password!");
          return;
        }
      }

      // SAVE LOGIN STATUS
      localStorage.setItem(
        "token",
        "ai-teacher-user-token"
      );

      // CURRENT USER
      localStorage.setItem(
        "currentUserEmail",
        cleanEmail
      );

      // OLD COMPATIBILITY KEY
      localStorage.setItem(
        "userEmail",
        cleanEmail
      );

      // REMEMBER ME
      localStorage.setItem(
        "rememberMe",
        rememberMe ? "true" : "false"
      );

      alert(
        "Login successful! Welcome to AI Teacher 🚀"
      );

      // GO TO DASHBOARD
      navigate("/dashboard", { replace: true });

      // Refresh Navbar and user data
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while logging in. Please try again."
      );
    }
  };

  const handleForgotPassword = () => {
    alert("Password recovery feature is coming soon!");
  };

  const handleGoogleLogin = () => {
    alert("Google login feature is coming soon!");
  };

  const handleGithubLogin = () => {
    alert("GitHub login feature is coming soon!");
  };

  const handleCreateAccount = () => {
    alert(
      "To create a new account, enter a new email and password, then click Sign In!"
    );
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}

      <div className="login-left">

        <div className="login-decoration decoration-one"></div>

        <div className="login-decoration decoration-two"></div>


        {/* BRAND */}

        <div className="login-brand">

          <div className="login-logo">
            🤖
          </div>

          <span>
            AI Teacher
          </span>

        </div>


        {/* CONTENT */}

        <div className="login-content">

          <p className="login-tag">
            SMART LEARNING PLATFORM
          </p>

          <h1>
            Learn Smarter.
            <br />
            Grow Faster.
          </h1>

          <p className="login-description">
            Experience personalized learning powered by
            Artificial Intelligence.
          </p>


          {/* FEATURES */}

          <div className="feature-list">

            <div className="login-feature">

              <div className="feature-icon">
                🧠
              </div>

              <div>

                <h3>
                  AI Personalized Learning
                </h3>

                <p>
                  Learn according to your own speed and
                  knowledge level.
                </p>

              </div>

            </div>


            <div className="login-feature">

              <div className="feature-icon">
                📊
              </div>

              <div>

                <h3>
                  Smart Progress Tracking
                </h3>

                <p>
                  Track your learning journey with
                  intelligent analytics.
                </p>

              </div>

            </div>


            <div className="login-feature">

              <div className="feature-icon">
                ⚡
              </div>

              <div>

                <h3>
                  Instant AI Assistance
                </h3>

                <p>
                  Get explanations and guidance whenever
                  you need help.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="login-right">

        <div className="login-card">


          {/* MOBILE BRAND */}

          <div className="mobile-brand">
            🤖 AI Teacher
          </div>


          {/* LOGIN HEADER */}

          <p className="login-card-tag">
            WELCOME BACK
          </p>

          <h2>
            Sign in to continue 👋
          </h2>

          <p className="login-card-description">
            Continue your personalized learning journey.
          </p>


          {/* LOGIN FORM */}

          <form onSubmit={handleLogin}>


            {/* EMAIL */}

            <div className="login-input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-box">

                <span>
                  ✉️
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="login-input-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>

              </div>


              <div className="input-box">

                <span>
                  🔒
                </span>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>

            </div>


            {/* REMEMBER ME */}

            <div className="remember-row">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-btn"
            >
              Sign In

              <span>
                →
              </span>

            </button>

          </form>


          {/* DIVIDER */}

          <div className="login-divider">

            <span>
              OR CONTINUE WITH
            </span>

          </div>


          {/* SOCIAL LOGIN */}

          <div className="social-login">

            <button
              type="button"
              onClick={handleGoogleLogin}
            >
              <span>G</span>

              Google
            </button>


            <button
              type="button"
              onClick={handleGithubLogin}
            >
              <span>◉</span>

              GitHub
            </button>

          </div>


          {/* CREATE ACCOUNT */}

          <p className="signup-text">

            Don't have an account?

            <button
              type="button"
              onClick={handleCreateAccount}
            >
              Create Account
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;