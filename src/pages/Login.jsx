import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginStudent } from "../services/api";

function Login() {

    // ========================================
    // STATE
    // ========================================

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();


    // ========================================
    // HANDLE LOGIN
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ========================================
        // VALIDATION
        // ========================================

        if (!email.trim()) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        if (!password.trim()) {

            setError(
                "Please enter your password."
            );

            return;
        }


        try {

            setLoading(true);


            // ========================================
            // LOGIN API
            // ========================================

            const response =
                await loginStudent({

                    email:
                        email
                            .trim()
                            .toLowerCase(),

                    password:
                        password

                });


            console.log(
                "LOGIN RESPONSE:",
                response
            );


            // ========================================
            // GET TOKEN
            // ========================================

            /*
                Different backends may return:

                response.token

                OR

                response.data.token
            */

            const token =
                response?.token ||
                response?.data?.token;


            // ========================================
            // GET USER
            // ========================================

            const user =
                response?.user ||
                response?.data?.user;


            // ========================================
            // CHECK TOKEN
            // ========================================

            if (!token) {

                console.error(
                    "Login response does not contain JWT token:",
                    response
                );

                setError(
                    "Login failed. Server did not return an authentication token."
                );

                return;
            }


            // ========================================
            // SAVE JWT TOKEN
            // ========================================

            localStorage.setItem(
                "token",
                token
            );


            // ========================================
            // SAVE USER DATA
            // ========================================

            if (user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

            }


            // ========================================
            // SAVE LOGIN STATUS
            // ========================================

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );


            // ========================================
            // DEBUG TOKEN
            // ========================================

            console.log(
                "JWT TOKEN SAVED:",
                localStorage.getItem("token")
            );


            console.log(
                "USER SAVED:",
                localStorage.getItem("user")
            );


            // ========================================
            // SUCCESS MESSAGE
            // ========================================

            setSuccess(
                "Login successful! Redirecting..."
            );


            // ========================================
            // REDIRECT
            // ========================================

            setTimeout(() => {

                navigate(
                    "/student/dashboard"
                );

            }, 1000);


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            // ========================================
            // ERROR MESSAGE
            // ========================================

            setError(

                error?.message ||

                "Unable to login. Please check your email and password."

            );


        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // GO TO REGISTER
    // ========================================

    const goToRegister = () => {

        navigate(
            "/register"
        );

    };


    // ========================================
    // GO TO HOME
    // ========================================

    const goToHome = () => {

        navigate(
            "/"
        );

    };


    // ========================================
    // LOGIN UI
    // ========================================

    return (

        <div className="login-page">

            <div className="login-container">


                {/* ========================================
                    HOSTEL TITLE
                ======================================== */}

                <h1>
                    RAMS BOYS HOSTEL
                </h1>


                <h2>
                    Student Login
                </h2>


                {/* ========================================
                    ERROR MESSAGE
                ======================================== */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                {/* ========================================
                    SUCCESS MESSAGE
                ======================================== */}

                {success && (

                    <div className="success-message">

                        {success}

                    </div>

                )}


                {/* ========================================
                    LOGIN FORM
                ======================================== */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                >


                    {/* ========================================
                        EMAIL
                    ======================================== */}

                    <div className="form-group">

                        <label htmlFor="email">

                            Email

                        </label>


                        <input

                            id="email"

                            type="email"

                            placeholder=
                                "Enter your email"

                            value={
                                email
                            }

                            onChange={
                                (e) => {

                                    setEmail(
                                        e.target.value
                                    );

                                    setError("");

                                }
                            }

                            disabled={
                                loading
                            }

                            autoComplete=
                                "email"

                            required

                        />

                    </div>


                    {/* ========================================
                        PASSWORD
                    ======================================== */}

                    <div className="form-group">

                        <label htmlFor="password">

                            Password

                        </label>


                        <input

                            id="password"

                            type="password"

                            placeholder=
                                "Enter your password"

                            value={
                                password
                            }

                            onChange={
                                (e) => {

                                    setPassword(
                                        e.target.value
                                    );

                                    setError("");

                                }
                            }

                            disabled={
                                loading
                            }

                            autoComplete=
                                "current-password"

                            required

                        />

                    </div>


                    {/* ========================================
                        LOGIN BUTTON
                    ======================================== */}

                    <button

                        type="submit"

                        disabled={
                            loading
                        }

                    >

                        {loading

                            ? "Logging in..."

                            : "Login"

                        }

                    </button>


                </form>


                {/* ========================================
                    REGISTER
                ======================================== */}

                <div className="register-link">

                    <p>

                        Don't have an account?

                    </p>


                    <button

                        type="button"

                        onClick={
                            goToRegister
                        }

                        disabled={
                            loading
                        }

                    >

                        Create Student Account

                    </button>

                </div>


                {/* ========================================
                    HOME
                ======================================== */}

                <div className="home-link">

                    <button

                        type="button"

                        onClick={
                            goToHome
                        }

                    >

                        Back to Home

                    </button>

                </div>


            </div>

        </div>

    );

}

export default Login;