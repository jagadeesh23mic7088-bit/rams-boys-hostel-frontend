import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerStudent } from "../services/api";

import "./Register.css";

function Register() {

    const navigate = useNavigate();

    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });


    // =====================================================
    // STATE
    // =====================================================

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previousData) => ({

            ...previousData,

            [name]: value

        }));

        // Clear previous messages
        setError("");

        setSuccess("");

    };


    // =====================================================
    // HANDLE REGISTRATION
    // =====================================================

    const handleRegister = async (e) => {

        e.preventDefault();

        // Clear previous messages
        setError("");

        setSuccess("");


        // =================================================
        // VALIDATE REQUIRED FIELDS
        // =================================================

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {

            setError(
                "Please fill in all the required fields."
            );

            return;

        }


        // =================================================
        // VALIDATE PASSWORD LENGTH
        // =================================================

        if (formData.password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;

        }


        // =================================================
        // VALIDATE PASSWORD MATCH
        // =================================================

        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        // =================================================
        // START LOADING
        // =================================================

        setLoading(true);


        try {

            // =================================================
            // CALL REGISTER API
            // =================================================

            const response = await registerStudent({

                name:
                    formData.name.trim(),

                email:
                    formData.email.trim(),

                password:
                    formData.password

            });


            // =================================================
            // DEBUG RESPONSE
            // =================================================

            console.log(
                "Registration Response:",
                response
            );


            // =================================================
            // SHOW SUCCESS MESSAGE
            // =================================================

            setSuccess(

                response?.message ||

                "Registration successful! Redirecting to login..."

            );


            // =================================================
            // CLEAR FORM
            // =================================================

            setFormData({

                name: "",

                email: "",

                password: "",

                confirmPassword: ""

            });


            // =================================================
            // REDIRECT TO LOGIN
            // =================================================

            setTimeout(() => {

                navigate("/login");

            }, 2000);


        } catch (error) {

            // =================================================
            // HANDLE REGISTRATION ERROR
            // =================================================

            console.error(
                "Registration Error:",
                error
            );


            setError(

                error?.message ||

                "Registration failed. Please try again."

            );

        } finally {

            // =================================================
            // STOP LOADING
            // =================================================

            setLoading(false);

        }

    };


    // =====================================================
    // PAGE UI
    // =====================================================

    return (

        <div className="register-page">


            {/* =================================================
                LEFT BRAND PANEL
            ================================================= */}

            <div className="register-brand-panel">

                <div className="register-brand-content">


                    {/* BRAND LOGO */}

                    <div className="register-brand-logo">
                        RB
                    </div>


                    {/* BRAND NAME */}

                    <h1>
                        RAMS BOYS HOSTEL
                    </h1>


                    {/* TAGLINE */}

                    <p className="register-tagline">

                        Your comfortable and affordable
                        home away from home.

                    </p>


                    {/* =================================================
                        BENEFITS
                    ================================================= */}

                    <div className="register-benefits">


                        {/* BENEFIT 1 */}

                        <div className="register-benefit">

                            <span>
                                ✓
                            </span>

                            <p>

                                Comfortable and affordable
                                student accommodation.

                            </p>

                        </div>


                        {/* BENEFIT 2 */}

                        <div className="register-benefit">

                            <span>
                                ✓
                            </span>

                            <p>

                                Free Wi-Fi available
                                in every room.

                            </p>

                        </div>


                        {/* BENEFIT 3 */}

                        <div className="register-benefit">

                            <span>
                                ✓
                            </span>

                            <p>

                                Delicious food and essential
                                hostel facilities.

                            </p>

                        </div>


                        {/* BENEFIT 4 */}

                        <div className="register-benefit">

                            <span>
                                ✓
                            </span>

                            <p>

                                Convenient branches near
                                VIT-AP University.

                            </p>

                        </div>


                    </div>

                </div>

            </div>


            {/* =================================================
                RIGHT FORM PANEL
            ================================================= */}

            <div className="register-form-panel">


                {/* =================================================
                    REGISTRATION CARD
                ================================================= */}

                <div className="register-container">


                    {/* =================================================
                        MOBILE BRAND
                    ================================================= */}

                    <div className="register-mobile-brand">

                        <div className="register-mobile-logo">
                            RB
                        </div>

                        <h1>
                            RAMS BOYS HOSTEL
                        </h1>

                    </div>


                    {/* =================================================
                        FORM HEADER
                    ================================================= */}

                    <div className="register-header">

                        <span className="register-welcome-label">

                            STUDENT REGISTRATION

                        </span>

                        <h2>
                            Create Your Account
                        </h2>

                        <p>

                            Register now to explore available
                            rooms and reserve your preferred
                            accommodation.

                        </p>

                    </div>


                    {/* =================================================
                        ERROR MESSAGE
                    ================================================= */}

                    {error && (

                        <div className="register-alert register-error">

                            <span>
                                ⚠️
                            </span>

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        SUCCESS MESSAGE
                    ================================================= */}

                    {success && (

                        <div className="register-alert register-success">

                            <span>
                                ✅
                            </span>

                            <p>
                                {success}
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        REGISTRATION FORM
                    ================================================= */}

                    <form
                        className="register-form"
                        onSubmit={handleRegister}
                    >


                        {/* =================================================
                            FULL NAME
                        ================================================= */}

                        <div className="register-field">

                            <label htmlFor="name">

                                Full Name

                            </label>

                            <div className="register-input-wrapper">

                                <span className="register-input-icon">
                                    👤
                                </span>

                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                    autoComplete="name"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            EMAIL ADDRESS
                        ================================================= */}

                        <div className="register-field">

                            <label htmlFor="email">

                                Email Address

                            </label>

                            <div className="register-input-wrapper">

                                <span className="register-input-icon">
                                    📧
                                </span>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    autoComplete="email"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            PASSWORD
                        ================================================= */}

                        <div className="register-field">

                            <label htmlFor="password">

                                Password

                            </label>

                            <div className="register-input-wrapper">

                                <span className="register-input-icon">
                                    🔐
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >

                                    {showPassword
                                        ? "HIDE"
                                        : "SHOW"
                                    }

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            CONFIRM PASSWORD
                        ================================================= */}

                        <div className="register-field">

                            <label htmlFor="confirmPassword">

                                Confirm Password

                            </label>

                            <div className="register-input-wrapper">

                                <span className="register-input-icon">
                                    🔑
                                </span>

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Re-enter your password"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                    disabled={loading}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >

                                    {showConfirmPassword
                                        ? "HIDE"
                                        : "SHOW"
                                    }

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            SUBMIT BUTTON
                        ================================================= */}

                        <button
                            type="submit"
                            className="register-submit-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>

                                    <span className="register-spinner">
                                    </span>

                                    Creating Account...

                                </>

                            ) : (

                                <>

                                    Create Student Account

                                    <span>
                                        →
                                    </span>

                                </>

                            )}

                        </button>


                    </form>


                    {/* =================================================
                        LOGIN SECTION
                    ================================================= */}

                    <div className="already-account-section">

                        <p>
                            Already have an account?
                        </p>

                        <button
                            type="button"
                            className="go-login-button"
                            onClick={() =>
                                navigate("/login")
                            }
                        >

                            Login Here

                            <span>
                                →
                            </span>

                        </button>

                    </div>


                    {/* =================================================
                        DIVIDER
                    ================================================= */}

                    <div className="register-divider">

                        <span>
                            OR
                        </span>

                    </div>


                    {/* =================================================
                        HOME BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        className="register-home-button"
                        onClick={() =>
                            navigate("/")
                        }
                    >

                        ← Back to Home

                    </button>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="register-footer">

                        <span>
                            🔐
                        </span>

                        <p>
                            Your information is securely protected.
                        </p>

                    </div>


                </div>

            </div>

        </div>

    );

}

export default Register;