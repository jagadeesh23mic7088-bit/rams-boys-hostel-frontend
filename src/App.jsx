import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import "./App.css";


// ========================================
// PUBLIC PAGES
// ========================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rooms from "./pages/Rooms";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";


// ========================================
// PAYMENT PAGE
// ========================================

import Payment from "./pages/Payment";


// ========================================
// STUDENT PAGES
// ========================================

import StudentDashboard from "./pages/StudentDashboard";


// ========================================
// ADMIN PAGES
// ========================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminRooms from "./pages/AdminRooms";


// ========================================
// APP COMPONENT
// ========================================

function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* ========================================
                    HOME PAGE
                ======================================== */}

                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />


                {/* ========================================
                    LOGIN
                ======================================== */}

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />


                {/* ========================================
                    REGISTER
                ======================================== */}

                <Route
                    path="/register"
                    element={
                        <Register />
                    }
                />


                {/* ========================================
                    ROOMS
                ======================================== */}

                <Route
                    path="/rooms"
                    element={
                        <Rooms />
                    }
                />


                {/* ========================================
                    BOOKING
                ======================================== */}

                <Route
                    path="/booking"
                    element={
                        <Booking />
                    }
                />


                {/* ========================================
                    PAYMENT
                ======================================== */}

                <Route
                    path="/payment"
                    element={
                        <Payment />
                    }
                />


                {/* ========================================
                    CONTACT
                ======================================== */}

                <Route
                    path="/contact"
                    element={
                        <Contact />
                    }
                />


                {/* ========================================
                    STUDENT DASHBOARD
                ======================================== */}

                <Route
                    path="/student/dashboard"
                    element={
                        <StudentDashboard />
                    }
                />


                {/* ========================================
                    STUDENT PROFILE
                ======================================== */}

                <Route
                    path="/student/profile"
                    element={

                        <div
                            style={{
                                padding: "50px",
                                textAlign: "center"
                            }}
                        >

                            <h1>
                                Student Profile
                            </h1>

                            <p>
                                Profile page is under development.
                            </p>

                        </div>

                    }
                />


                {/* ========================================
                    STUDENT BOOKINGS
                ======================================== */}

                <Route
                    path="/student/bookings"
                    element={

                        <div
                            style={{
                                padding: "50px",
                                textAlign: "center"
                            }}
                        >

                            <h1>
                                My Bookings
                            </h1>

                            <p>
                                Bookings page is under development.
                            </p>

                        </div>

                    }
                />


                {/* ========================================
                    STUDENT PAYMENTS
                ======================================== */}

                <Route
                    path="/student/payments"
                    element={

                        <div
                            style={{
                                padding: "50px",
                                textAlign: "center"
                            }}
                        >

                            <h1>
                                Payment History
                            </h1>

                            <p>
                                Payment history page is under development.
                            </p>

                        </div>

                    }
                />


                {/* ========================================
                    ADMIN DASHBOARD
                ======================================== */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminDashboard />
                    }
                />


                {/* ========================================
                    ADMIN ROOM MANAGEMENT
                ======================================== */}

                <Route
                    path="/admin/rooms"
                    element={
                        <AdminRooms />
                    }
                />


                {/* ========================================
                    UNKNOWN ROUTE
                    REDIRECT TO HOME
                ======================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


// ========================================
// EXPORT APP
// ========================================

export default App;