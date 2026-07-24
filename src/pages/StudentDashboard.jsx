import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getStudentDashboard,
    getStudentProfile,
    getStudentBookings,
    getStudentPayments
} from "../services/api";

function StudentDashboard() {

    // ========================================
    // STATE
    // ========================================

    const [user, setUser] = useState(null);
    const [dashboard, setDashboard] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // ========================================
    // LOAD STUDENT DATA
    // ========================================

    useEffect(() => {

        const loadStudentData = async () => {

            try {

                setLoading(true);
                setError("");

                // ========================================
                // CHECK TOKEN
                // ========================================

                const token =
                    localStorage.getItem("token");

                if (!token) {

                    navigate("/login");

                    return;
                }


                // ========================================
                // GET SAVED USER
                // ========================================

                const savedUser =
                    localStorage.getItem("user");

                if (savedUser) {

                    setUser(
                        JSON.parse(savedUser)
                    );

                }


                // ========================================
                // GET DASHBOARD
                // ========================================

                try {

                    const dashboardResponse =
                        await getStudentDashboard();

                    console.log(
                        "Dashboard:",
                        dashboardResponse
                    );

                    setDashboard(
                        dashboardResponse
                    );

                } catch (error) {

                    console.error(
                        "Dashboard Error:",
                        error
                    );

                }


                // ========================================
                // GET PROFILE
                // ========================================

                try {

                    const profileResponse =
                        await getStudentProfile();

                    console.log(
                        "Profile:",
                        profileResponse
                    );

                    if (
                        profileResponse.success &&
                        profileResponse.student
                    ) {

                        setUser(
                            profileResponse.student
                        );

                    }

                } catch (error) {

                    console.error(
                        "Profile Error:",
                        error
                    );

                }


                // ========================================
                // GET BOOKINGS
                // ========================================

                try {

                    const bookingsResponse =
                        await getStudentBookings();

                    console.log(
                        "Bookings:",
                        bookingsResponse
                    );

                    if (
                        bookingsResponse.bookings
                    ) {

                        setBookings(
                            bookingsResponse.bookings
                        );

                    }

                } catch (error) {

                    console.error(
                        "Bookings Error:",
                        error
                    );

                }


                // ========================================
                // GET PAYMENTS
                // ========================================

                try {

                    const paymentsResponse =
                        await getStudentPayments();

                    console.log(
                        "Payments:",
                        paymentsResponse
                    );

                    if (
                        paymentsResponse.payments
                    ) {

                        setPayments(
                            paymentsResponse.payments
                        );

                    }

                } catch (error) {

                    console.error(
                        "Payments Error:",
                        error
                    );

                }

            } catch (error) {

                console.error(
                    "Student Dashboard Error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load student dashboard"
                );

            } finally {

                setLoading(false);

            }

        };


        loadStudentData();

    }, [navigate]);


    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        localStorage.removeItem("isLoggedIn");

        navigate("/login");

    };


    // ========================================
    // LOADING SCREEN
    // ========================================

    if (loading) {

        return (

            <div className="student-dashboard">

                <div className="dashboard-container">

                    <h2>
                        Loading Student Dashboard...
                    </h2>

                    <p>
                        Please wait while we load your information.
                    </p>

                </div>

            </div>

        );

    }


    // ========================================
    // ERROR SCREEN
    // ========================================

    if (error) {

        return (

            <div className="student-dashboard">

                <div className="dashboard-container">

                    <h2>
                        Dashboard Error
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        );

    }


    // ========================================
    // DASHBOARD
    // ========================================

    return (

        <div className="student-dashboard">

            {/* ========================================
                NAVBAR
            ======================================== */}

            <nav className="student-navbar">

                <div className="navbar-brand">

                    <h2>
                        RAMS BOYS HOSTEL
                    </h2>

                </div>


                <div className="navbar-actions">

                    <button
                        onClick={() =>
                            navigate("/student/profile")
                        }
                    >
                        My Profile
                    </button>

                    <button
                        onClick={() =>
                            navigate("/rooms")
                        }
                    >
                        Rooms
                    </button>

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* ========================================
                MAIN CONTENT
            ======================================== */}

            <main className="dashboard-container">

                {/* ========================================
                    WELCOME
                ======================================== */}

                <section className="welcome-section">

                    <h1>
                        Welcome,
                        {" "}
                        {user?.name || "Student"}!
                    </h1>

                    <p>
                        Welcome to your RAMS Boys Hostel student dashboard.
                    </p>

                </section>


                {/* ========================================
                    ERROR MESSAGE
                ======================================== */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                {/* ========================================
                    DASHBOARD CARDS
                ======================================== */}

                <section className="dashboard-cards">

                    <div className="dashboard-card">

                        <h3>
                            My Bookings
                        </h3>

                        <p className="card-number">
                            {bookings.length}
                        </p>

                        <button
                            onClick={() =>
                                navigate("/student/bookings")
                            }
                        >
                            View Bookings
                        </button>

                    </div>


                    <div className="dashboard-card">

                        <h3>
                            Payments
                        </h3>

                        <p className="card-number">
                            {payments.length}
                        </p>

                        <button
                            onClick={() =>
                                navigate("/student/payments")
                            }
                        >
                            View Payments
                        </button>

                    </div>


                    <div className="dashboard-card">

                        <h3>
                            Profile
                        </h3>

                        <p>
                            Manage your personal information
                        </p>

                        <button
                            onClick={() =>
                                navigate("/student/profile")
                            }
                        >
                            View Profile
                        </button>

                    </div>


                    <div className="dashboard-card">

                        <h3>
                            Available Rooms
                        </h3>

                        <p>
                            Find your preferred hostel room
                        </p>

                        <button
                            onClick={() =>
                                navigate("/rooms")
                            }
                        >
                            Browse Rooms
                        </button>

                    </div>

                </section>


                {/* ========================================
                    STUDENT INFORMATION
                ======================================== */}

                <section className="student-information">

                    <h2>
                        Student Information
                    </h2>

                    <div className="information-card">

                        <p>
                            <strong>
                                Name:
                            </strong>

                            {" "}

                            {user?.name || "Not available"}
                        </p>


                        <p>
                            <strong>
                                Email:
                            </strong>

                            {" "}

                            {user?.email || "Not available"}
                        </p>


                        <p>
                            <strong>
                                Role:
                            </strong>

                            {" "}

                            {user?.role || "Student"}
                        </p>

                    </div>

                </section>


                {/* ========================================
                    RECENT BOOKINGS
                ======================================== */}

                <section className="recent-bookings">

                    <h2>
                        Recent Bookings
                    </h2>

                    {bookings.length === 0 ? (

                        <div className="empty-state">

                            <p>
                                You don't have any bookings yet.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/rooms")
                                }
                            >
                                Find a Room
                            </button>

                        </div>

                    ) : (

                        <div className="booking-list">

                            {bookings
                                .slice(0, 5)
                                .map((booking) => (

                                    <div
                                        className="booking-item"
                                        key={booking._id}
                                    >

                                        <h3>
                                            {booking.branch?.name ||
                                                "Hostel Branch"}
                                        </h3>

                                        <p>
                                            Room Type:
                                            {" "}
                                            {booking.roomType?.name ||
                                                "Not available"}
                                        </p>

                                        <p>
                                            Monthly Rent:
                                            {" "}
                                            ₹{booking.monthlyRent || 0}
                                        </p>

                                        <p>
                                            Status:
                                            {" "}
                                            {booking.status ||
                                                "Unknown"}
                                        </p>

                                    </div>

                                ))}

                        </div>

                    )}

                </section>


                {/* ========================================
                    DASHBOARD API DATA
                ======================================== */}

                {dashboard && (

                    <section className="dashboard-api-data">

                        <h2>
                            Account Overview
                        </h2>

                        <p>
                            Your student account is active.
                        </p>

                    </section>

                )}

            </main>

        </div>

    );

}

export default StudentDashboard;