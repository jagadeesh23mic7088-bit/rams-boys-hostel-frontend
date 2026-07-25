import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getStudentDashboard,
    getStudentProfile,
    getStudentBookings,
    getStudentPayments
} from "../services/api";

import "./StudentDashboard.css";


function StudentDashboard() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [user, setUser] = useState(null);

    const [dashboard, setDashboard] = useState(null);

    const [bookings, setBookings] = useState([]);

    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [sidebarOpen, setSidebarOpen] = useState(false);


    // =====================================================
    // LOAD STUDENT DATA
    // =====================================================

    useEffect(() => {

        const loadStudentData = async () => {

            try {

                setLoading(true);

                setError("");


                // =================================================
                // CHECK LOGIN TOKEN
                // =================================================

                const token =
                    localStorage.getItem("token");


                if (!token) {

                    navigate("/login");

                    return;

                }


                // =================================================
                // LOAD SAVED USER
                // =================================================

                const savedUser =
                    localStorage.getItem("user");


                if (savedUser) {

                    try {

                        setUser(
                            JSON.parse(savedUser)
                        );

                    } catch (error) {

                        console.error(
                            "Unable to read saved user:",
                            error
                        );

                    }

                }


                // =================================================
                // LOAD DASHBOARD
                // =================================================

                try {

                    const response =
                        await getStudentDashboard();


                    console.log(
                        "Student Dashboard:",
                        response
                    );


                    const dashboardData =
                        response?.data ||
                        response;


                    setDashboard(
                        dashboardData
                    );

                } catch (error) {

                    console.error(
                        "Dashboard API Error:",
                        error
                    );

                }


                // =================================================
                // LOAD PROFILE
                // =================================================

                try {

                    const response =
                        await getStudentProfile();


                    console.log(
                        "Student Profile:",
                        response
                    );


                    const profile =
                        response?.student ||
                        response?.data?.student ||
                        response?.user ||
                        response?.data?.user;


                    if (profile) {

                        setUser(profile);


                        localStorage.setItem(
                            "user",
                            JSON.stringify(profile)
                        );

                    }

                } catch (error) {

                    console.error(
                        "Profile API Error:",
                        error
                    );

                }


                // =================================================
                // LOAD BOOKINGS
                // =================================================

                try {

                    const response =
                        await getStudentBookings();


                    console.log(
                        "Student Bookings:",
                        response
                    );


                    const bookingData =
                        response?.bookings ||
                        response?.data?.bookings ||
                        [];


                    setBookings(

                        Array.isArray(
                            bookingData
                        )

                            ? bookingData

                            : []

                    );

                } catch (error) {

                    console.error(
                        "Bookings API Error:",
                        error
                    );

                }


                // =================================================
                // LOAD PAYMENTS
                // =================================================

                try {

                    const response =
                        await getStudentPayments();


                    console.log(
                        "Student Payments:",
                        response
                    );


                    const paymentData =
                        response?.payments ||
                        response?.data?.payments ||
                        [];


                    setPayments(

                        Array.isArray(
                            paymentData
                        )

                            ? paymentData

                            : []

                    );

                } catch (error) {

                    console.error(
                        "Payments API Error:",
                        error
                    );

                }

            } catch (error) {

                console.error(
                    "Student Dashboard Error:",
                    error
                );


                setError(

                    error?.message ||

                    "Unable to load student dashboard."

                );

            } finally {

                setLoading(false);

            }

        };


        loadStudentData();

    }, [navigate]);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "isLoggedIn"
        );


        navigate(
            "/login"
        );

    };


    // =====================================================
    // STUDENT NAME
    // =====================================================

    const studentName =
        user?.name ||
        "Student";


    // =====================================================
    // GET USER INITIALS
    // =====================================================

    const getInitials = () => {

        if (!studentName) {

            return "S";

        }


        const parts =
            studentName
                .trim()
                .split(" ");


        if (
            parts.length >= 2
        ) {

            return (

                parts[0][0] +

                parts[
                    parts.length - 1
                ][0]

            ).toUpperCase();

        }


        return (

            studentName[0]

        ).toUpperCase();

    };


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

            <div className="student-loading-page">

                <div className="student-loading-card">

                    <div className="student-loading-logo">
                        RB
                    </div>


                    <div className="loading-spinner"></div>


                    <h2>
                        Loading your dashboard
                    </h2>


                    <p>
                        Please wait while we prepare
                        your RAMS Boys Hostel account.
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR SCREEN
    // =====================================================

    if (error) {

        return (

            <div className="student-error-page">

                <div className="student-error-card">

                    <div className="error-icon">
                        !
                    </div>


                    <h2>
                        Unable to load dashboard
                    </h2>


                    <p>
                        {error}
                    </p>


                    <div className="error-actions">

                        <button
                            className="student-primary-button"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try Again
                        </button>


                        <button
                            className="student-secondary-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN DASHBOARD
    // =====================================================

    return (

        <div className="student-dashboard">


            {/* =================================================
                MOBILE SIDEBAR OVERLAY
            ================================================= */}

            {sidebarOpen && (

                <div
                    className="sidebar-overlay"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                ></div>

            )}


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={
                    sidebarOpen
                        ? "student-sidebar open"
                        : "student-sidebar"
                }
            >


                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="sidebar-brand">

                    <div className="sidebar-logo">
                        RB
                    </div>


                    <div className="sidebar-brand-text">

                        <strong>
                            RAMS BOYS
                        </strong>

                        <span>
                            HOSTEL
                        </span>

                    </div>

                </div>


                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <nav className="sidebar-navigation">


                    <span className="navigation-label">
                        MAIN MENU
                    </span>


                    {/* DASHBOARD */}

                    <button
                        className="sidebar-nav-item active"
                        onClick={() => {

                            navigate(
                                "/student/dashboard"
                            );

                            setSidebarOpen(false);

                        }}
                    >

                        <span className="nav-icon">
                            ▦
                        </span>

                        <span>
                            Dashboard
                        </span>

                    </button>


                    {/* BROWSE ROOMS */}

                    <button
                        className="sidebar-nav-item"
                        onClick={() => {

                            navigate(
                                "/rooms"
                            );

                            setSidebarOpen(false);

                        }}
                    >

                        <span className="nav-icon">
                            ▤
                        </span>

                        <span>
                            Browse Rooms
                        </span>

                    </button>


                    {/* BOOKINGS */}

                    <button
                        className="sidebar-nav-item"
                        onClick={() => {

                            navigate(
                                "/student/bookings"
                            );

                            setSidebarOpen(false);

                        }}
                    >

                        <span className="nav-icon">
                            ▣
                        </span>

                        <span>
                            My Bookings
                        </span>


                        {bookings.length > 0 && (

                            <span className="nav-count">
                                {bookings.length}
                            </span>

                        )}

                    </button>


                    {/* PAYMENTS */}

                    <button
                        className="sidebar-nav-item"
                        onClick={() => {

                            navigate(
                                "/student/payments"
                            );

                            setSidebarOpen(false);

                        }}
                    >

                        <span className="nav-icon">
                            ₹
                        </span>

                        <span>
                            Payments
                        </span>

                    </button>


                    <span className="navigation-label second-label">
                        ACCOUNT
                    </span>


                    {/* PROFILE */}

                    <button
                        className="sidebar-nav-item"
                        onClick={() => {

                            navigate(
                                "/student/profile"
                            );

                            setSidebarOpen(false);

                        }}
                    >

                        <span className="nav-icon">
                            ◉
                        </span>

                        <span>
                            My Profile
                        </span>

                    </button>

                </nav>


                {/* =================================================
                    SIDEBAR FOOTER
                ================================================= */}

                <div className="sidebar-footer">


                    <div className="sidebar-support">

                        <span className="support-icon">
                            ?
                        </span>


                        <div>

                            <strong>
                                Need Help?
                            </strong>


                            <p>
                                Contact hostel administration
                            </p>

                        </div>

                    </div>


                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >

                        <span>
                            ↪
                        </span>

                        Logout

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN AREA
            ================================================= */}

            <div className="student-main">


                {/* =================================================
                    TOP HEADER
                ================================================= */}

                <header className="student-topbar">


                    <button
                        className="mobile-menu-button"
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                    >
                        ☰
                    </button>


                    <div className="topbar-page-title">

                        <span>
                            STUDENT PORTAL
                        </span>


                        <h2>
                            Dashboard
                        </h2>

                    </div>


                    <div className="topbar-right">


                        <button
                            className="notification-button"
                            title="Notifications"
                        >
                            🔔
                        </button>


                        <div
                            className="topbar-profile"
                            onClick={() =>
                                navigate(
                                    "/student/profile"
                                )
                            }
                        >

                            <div className="profile-avatar">
                                {getInitials()}
                            </div>


                            <div className="profile-details">

                                <strong>
                                    {studentName}
                                </strong>

                                <span>
                                    Student
                                </span>

                            </div>


                            <span className="profile-arrow">
                                ▼
                            </span>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <main className="student-content">


                    {/* =================================================
                        WELCOME BANNER
                    ================================================= */}

                    <section className="welcome-banner">


                        <div className="welcome-content">

                            <span className="welcome-label">
                                WELCOME BACK
                            </span>


                            <h1>
                                Hello, {studentName}!
                            </h1>


                            <p>
                                Manage your accommodation,
                                bookings and payments from
                                your student portal.
                            </p>


                            <button
                                className="welcome-button"
                                onClick={() =>
                                    navigate("/rooms")
                                }
                            >

                                Find Your Room

                                <span>
                                    →
                                </span>

                            </button>

                        </div>


                        <div className="welcome-decoration">

                            <div className="decoration-circle circle-one"></div>

                            <div className="decoration-circle circle-two"></div>

                            <div className="decoration-house">
                                🏠
                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <section className="stats-grid">


                        <div className="stat-card">

                            <div className="stat-card-icon bookings-icon">
                                ▣
                            </div>


                            <div className="stat-card-content">

                                <span>
                                    MY BOOKINGS
                                </span>


                                <strong>
                                    {bookings.length}
                                </strong>


                                <small>
                                    Total reservations
                                </small>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-icon payments-icon">
                                ₹
                            </div>


                            <div className="stat-card-content">

                                <span>
                                    PAYMENTS
                                </span>


                                <strong>
                                    {payments.length}
                                </strong>


                                <small>
                                    Payment records
                                </small>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-icon profile-icon">
                                ✓
                            </div>


                            <div className="stat-card-content">

                                <span>
                                    ACCOUNT STATUS
                                </span>


                                <strong className="active-status">
                                    Active
                                </strong>


                                <small>
                                    Account in good standing
                                </small>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-icon rooms-icon">
                                ▤
                            </div>


                            <div className="stat-card-content">

                                <span>
                                    ROOM SEARCH
                                </span>


                                <strong>
                                    Ready
                                </strong>


                                <small>
                                    Find your accommodation
                                </small>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        MAIN GRID
                    ================================================= */}

                    <div className="dashboard-main-grid">


                        {/* =================================================
                            QUICK ACTIONS
                        ================================================= */}

                        <section className="dashboard-panel quick-actions-panel">


                            <div className="panel-header">

                                <div>

                                    <span className="panel-eyebrow">
                                        QUICK ACCESS
                                    </span>


                                    <h2>
                                        What would you like to do?
                                    </h2>

                                </div>

                            </div>


                            <div className="quick-actions-grid">


                                <button
                                    className="quick-action-card"
                                    onClick={() =>
                                        navigate("/rooms")
                                    }
                                >

                                    <div className="quick-action-icon blue">
                                        ▤
                                    </div>


                                    <div>

                                        <strong>
                                            Browse Rooms
                                        </strong>


                                        <p>
                                            Explore available rooms
                                            and accommodation options.
                                        </p>

                                    </div>


                                    <span className="action-arrow">
                                        →
                                    </span>

                                </button>


                                <button
                                    className="quick-action-card"
                                    onClick={() =>
                                        navigate(
                                            "/student/bookings"
                                        )
                                    }
                                >

                                    <div className="quick-action-icon purple">
                                        ▣
                                    </div>


                                    <div>

                                        <strong>
                                            My Bookings
                                        </strong>


                                        <p>
                                            View and manage your
                                            accommodation bookings.
                                        </p>

                                    </div>


                                    <span className="action-arrow">
                                        →
                                    </span>

                                </button>


                                <button
                                    className="quick-action-card"
                                    onClick={() =>
                                        navigate(
                                            "/student/payments"
                                        )
                                    }
                                >

                                    <div className="quick-action-icon green">
                                        ₹
                                    </div>


                                    <div>

                                        <strong>
                                            Payments
                                        </strong>


                                        <p>
                                            Check your payment history
                                            and transactions.
                                        </p>

                                    </div>


                                    <span className="action-arrow">
                                        →
                                    </span>

                                </button>


                                <button
                                    className="quick-action-card"
                                    onClick={() =>
                                        navigate(
                                            "/student/profile"
                                        )
                                    }
                                >

                                    <div className="quick-action-icon orange">
                                        ◉
                                    </div>


                                    <div>

                                        <strong>
                                            My Profile
                                        </strong>


                                        <p>
                                            Update your personal
                                            account information.
                                        </p>

                                    </div>


                                    <span className="action-arrow">
                                        →
                                    </span>

                                </button>

                            </div>

                        </section>


                        {/* =================================================
                            PROFILE SUMMARY
                        ================================================= */}

                        <section className="dashboard-panel profile-summary-panel">


                            <div className="panel-header">

                                <div>

                                    <span className="panel-eyebrow">
                                        ACCOUNT
                                    </span>


                                    <h2>
                                        My Profile
                                    </h2>

                                </div>


                                <button
                                    className="text-button"
                                    onClick={() =>
                                        navigate(
                                            "/student/profile"
                                        )
                                    }
                                >
                                    View Profile →
                                </button>

                            </div>


                            <div className="profile-summary">


                                <div className="large-profile-avatar">
                                    {getInitials()}
                                </div>


                                <div className="profile-summary-info">

                                    <h3>
                                        {studentName}
                                    </h3>


                                    <p>
                                        {user?.email ||
                                            "Email not available"}
                                    </p>


                                    <span className="account-badge">

                                        <span></span>

                                        Active Student

                                    </span>

                                </div>

                            </div>


                            <div className="profile-details-list">


                                <div className="profile-detail-row">

                                    <span>
                                        Account Role
                                    </span>


                                    <strong>
                                        {user?.role ||
                                            "Student"}
                                    </strong>

                                </div>


                                <div className="profile-detail-row">

                                    <span>
                                        Account Status
                                    </span>


                                    <strong className="green-text">
                                        Active
                                    </strong>

                                </div>

                            </div>


                            <button
                                className="profile-manage-button"
                                onClick={() =>
                                    navigate(
                                        "/student/profile"
                                    )
                                }
                            >
                                Manage My Profile
                            </button>

                        </section>

                    </div>


                    {/* =================================================
                        RECENT BOOKINGS
                    ================================================= */}

                    <section className="dashboard-panel recent-bookings-panel">


                        <div className="panel-header">

                            <div>

                                <span className="panel-eyebrow">
                                    ACCOMMODATION
                                </span>


                                <h2>
                                    Recent Bookings
                                </h2>

                            </div>


                            <button
                                className="text-button"
                                onClick={() =>
                                    navigate(
                                        "/student/bookings"
                                    )
                                }
                            >
                                View All →
                            </button>

                        </div>


                        {bookings.length === 0 ? (

                            <div className="no-bookings">


                                <div className="no-bookings-icon">
                                    ▣
                                </div>


                                <div>

                                    <h3>
                                        No bookings yet
                                    </h3>


                                    <p>
                                        You haven't made any
                                        accommodation bookings.
                                        Find your preferred room
                                        to get started.
                                    </p>

                                </div>


                                <button
                                    className="student-primary-button"
                                    onClick={() =>
                                        navigate("/rooms")
                                    }
                                >
                                    Browse Available Rooms →
                                </button>

                            </div>

                        ) : (

                            <div className="booking-table-wrapper">

                                <table className="student-bookings-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                BRANCH
                                            </th>

                                            <th>
                                                ROOM TYPE
                                            </th>

                                            <th>
                                                MONTHLY RENT
                                            </th>

                                            <th>
                                                STATUS
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {bookings
                                            .slice(0, 5)
                                            .map(
                                                (booking) => (

                                                    <tr
                                                        key={
                                                            booking._id
                                                        }
                                                    >

                                                        <td>

                                                            <strong>
                                                                {
                                                                    booking
                                                                        .branch
                                                                        ?.name ||
                                                                    "Hostel Branch"
                                                                }
                                                            </strong>

                                                        </td>


                                                        <td>

                                                            {
                                                                booking
                                                                    .roomType
                                                                    ?.name ||
                                                                "Room Type"
                                                            }

                                                        </td>


                                                        <td>

                                                            ₹
                                                            {Number(

                                                                booking.monthlyRent ||

                                                                booking.roomType
                                                                    ?.monthlyRent ||

                                                                0

                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}

                                                        </td>


                                                        <td>

                                                            <span className="booking-status">

                                                                <span></span>

                                                                {
                                                                    booking.status ||
                                                                    "Pending"
                                                                }

                                                            </span>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        HOSTEL INFORMATION
                    ================================================= */}

                    <section className="hostel-info-banner">


                        <div className="hostel-info-icon">
                            🏠
                        </div>


                        <div className="hostel-info-content">

                            <span>
                                RAMS BOYS HOSTEL
                            </span>


                            <h2>
                                Your comfort. Your community. Your home.
                            </h2>


                            <p>
                                Manage your accommodation easily
                                through your student portal.
                                Browse rooms, manage bookings and
                                keep track of your payments in one place.
                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate("/rooms")
                            }
                        >
                            Explore Rooms →
                        </button>

                    </section>

                </main>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <footer className="student-footer">

                    <p>

                        © {new Date().getFullYear()}

                        {" "}

                        RAMS BOYS HOSTEL.

                        All rights reserved.

                    </p>


                    <span>
                        Student Portal
                    </span>

                </footer>

            </div>

        </div>

    );

}


export default StudentDashboard;