import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginStudent } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ======================================================
  // LOGIN
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // ======================================================
    // VALIDATION
    // ======================================================

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!cleanPassword) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // ======================================================
      // LOGIN REQUEST
      // ======================================================

      const response = await loginStudent({
        email: cleanEmail,
        password: cleanPassword,
      });

      console.log("=================================");
      console.log("LOGIN RESPONSE");
      console.log(response);
      console.log("=================================");

      // ======================================================
      // HANDLE RESPONSE
      // ======================================================

      const responseData =
        response?.data || response;

      // ======================================================
      // GET TOKEN
      // ======================================================

      const token =
        responseData?.token ||
        response?.token ||
        response?.data?.token;

      // ======================================================
      // GET USER
      // ======================================================

      const user =
        responseData?.user ||
        response?.user ||
        response?.data?.user;

      console.log("TOKEN:", token);
      console.log("USER:", user);

      // ======================================================
      // TOKEN CHECK
      // ======================================================

      if (!token) {
        setError(
          "Login failed. The server did not return an authentication token."
        );

        return;
      }

      // ======================================================
      // USER CHECK
      // ======================================================

      if (!user) {
        setError(
          "Login failed. The server did not return user information."
        );

        return;
      }

      // ======================================================
      // GET USER ROLE
      // ======================================================

      const userRole =
        user?.role
          ?.toString()
          ?.trim()
          ?.toLowerCase();

      console.log("USER ROLE:", userRole);

      // ======================================================
      // SAVE TOKEN
      // ======================================================

      localStorage.setItem(
        "token",
        token
      );

      // ======================================================
      // SAVE USER
      // ======================================================

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // ======================================================
      // SAVE LOGIN STATUS
      // ======================================================

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      // ======================================================
      // SUCCESS
      // ======================================================

      setSuccess(
        "Login successful. Redirecting..."
      );

      // ======================================================
      // ADMIN LOGIN
      // ======================================================

      if (
        userRole === "admin" ||
        userRole === "administrator"
      ) {
        setTimeout(() => {
          navigate(
            "/admin/dashboard",
            {
              replace: true,
            }
          );
        }, 500);

        return;
      }

      // ======================================================
      // STUDENT LOGIN
      // ======================================================

      if (
        userRole === "student" ||
        userRole === "user"
      ) {
        setTimeout(() => {
          navigate(
            "/student/dashboard",
            {
              replace: true,
            }
          );
        }, 500);

        return;
      }

      // ======================================================
      // UNKNOWN ROLE
      // ======================================================

      setError(
        `Login successful, but the account role "${userRole || "unknown"}" is not recognized.`
      );

    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "LOGIN ERROR"
      );

      console.error(
        error
      );

      console.error(
        "================================="
      );

      // ======================================================
      // ERROR MESSAGE
      // ======================================================

      const errorMessage =
        error?.message ||
        "Invalid email or password.";

      setError(
        errorMessage
      );

      // ======================================================
      // CLEAR OLD LOGIN DATA
      // ======================================================

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "isLoggedIn"
      );

    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // REGISTER
  // ======================================================

  const goToRegister = () => {
    navigate(
      "/register"
    );
  };

  // ======================================================
  // HOME
  // ======================================================

  const goToHome = () => {
    navigate(
      "/"
    );
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="login-page">

      {/* ==================================================
          LEFT BRANDING
      ================================================== */}

      <div className="login-brand-panel">

        <div className="brand-content">

          <div className="brand-logo">
            🏠
          </div>

          <h1>
            RAMS BOYS HOSTEL
          </h1>

          <p className="brand-tagline">
            Your comfort. Your community. Your home.
          </p>

          <div className="brand-features">

            <div className="brand-feature">
              <span>✓</span>
              <p>
                Comfortable and affordable accommodation
              </p>
            </div>

            <div className="brand-feature">
              <span>✓</span>
              <p>
                Safe and student-friendly environment
              </p>
            </div>

            <div className="brand-feature">
              <span>✓</span>
              <p>
                Easy online room reservations
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          RIGHT LOGIN PANEL
      ================================================== */}

      <div className="login-form-panel">

        <div className="login-container">

          {/* MOBILE BRAND */}

          <div className="mobile-brand">

            <div className="mobile-logo">
              🏠
            </div>

            <h1>
              RAMS BOYS HOSTEL
            </h1>

          </div>


          {/* HEADER */}

          <div className="login-header">

            <span className="welcome-label">
              WELCOME BACK
            </span>

            <h2>
              Login
            </h2>

            <p>
              Sign in to manage your hostel
              accommodation and reservations.
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="login-alert login-error">

              <span>
                ⚠️
              </span>

              <p>
                {error}
              </p>

            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="login-alert login-success">

              <span>
                ✓
              </span>

              <p>
                {success}
              </p>

            </div>
          )}


          {/* LOGIN FORM */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(
                      e.target.value
                    );

                    setError("");
                  }}
                  disabled={loading}
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(
                      e.target.value
                    );

                    setError("");
                  }}
                  disabled={loading}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={loading}
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          {/* REGISTER */}

          <div className="create-account-section">

            <p>
              Don't have an account?
            </p>

            <button
              type="button"
              className="create-account-button"
              onClick={goToRegister}
              disabled={loading}
            >
              Create Student Account
              <span>→</span>
            </button>

          </div>


          {/* DIVIDER */}

          <div className="login-divider">
            <span>OR</span>
          </div>


          {/* HOME */}

          <button
            type="button"
            className="back-home-button"
            onClick={goToHome}
            disabled={loading}
          >
            <span>←</span>
            Back to Home
          </button>


          {/* FOOTER */}

          <div className="login-footer">

            <span>
              🔒
            </span>

            <p>
              Your account information is securely protected.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;