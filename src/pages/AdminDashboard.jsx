import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getBranches,
    getRoomTypes,
    getRooms
} from "../services/api";

function AdminDashboard() {

    const navigate = useNavigate();

    const [branches, setBranches] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ========================================
    // LOAD ADMIN DATA
    // ========================================

    useEffect(() => {

        const loadAdminData = async () => {

            try {

                setLoading(true);
                setError("");

                // Get all branches
                const branchResponse =
                    await getBranches();

                // Get all room types
                const roomTypeResponse =
                    await getRoomTypes();

                // Get all rooms
                const roomResponse =
                    await getRooms();

                console.log(
                    "Branches:",
                    branchResponse
                );

                console.log(
                    "Room Types:",
                    roomTypeResponse
                );

                console.log(
                    "Rooms:",
                    roomResponse
                );

                // Set branches
                setBranches(
                    branchResponse.branches || []
                );

                // Set room types
                setRoomTypes(
                    roomTypeResponse.roomTypes || []
                );

                // Set rooms
                setRooms(
                    roomResponse.rooms || []
                );

            } catch (error) {

                console.error(
                    "Admin Dashboard Error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load admin dashboard"
                );

            } finally {

                setLoading(false);

            }

        };

        loadAdminData();

    }, []);


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
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div className="admin-dashboard-page">

                <div className="admin-loading">

                    <h2>
                        Loading Admin Dashboard...
                    </h2>

                    <p>
                        Please wait while we load the system data.
                    </p>

                </div>

            </div>

        );

    }


    // ========================================
    // ERROR
    // ========================================

    if (error) {

        return (

            <div className="admin-dashboard-page">

                <div className="admin-error">

                    <h2>
                        Dashboard Error
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
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
    // ADMIN DASHBOARD
    // ========================================

    return (

        <div className="admin-dashboard-page">

            {/* ========================================
                ADMIN NAVBAR
            ======================================== */}

            <nav className="admin-navbar">

                <div className="admin-brand">

                    <h2>
                        RAMS BOYS HOSTEL
                    </h2>

                    <span>
                        ADMIN PANEL
                    </span>

                </div>


                <div className="admin-navbar-actions">

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        View Website
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

            <main className="admin-main-container">

                {/* HEADER */}

                <section className="admin-header">

                    <div>

                        <p className="admin-label">
                            ADMINISTRATION
                        </p>

                        <h1>
                            Dashboard Overview
                        </h1>

                        <p>
                            Manage RAMS Boys Hostel
                            operations from one place.
                        </p>

                    </div>

                </section>


                {/* ========================================
                    STATISTICS
                ======================================== */}

                <section className="admin-statistics">

                    <div className="admin-stat-card">

                        <div className="stat-icon">
                            🏢
                        </div>

                        <div>

                            <p>
                                Total Branches
                            </p>

                            <h2>
                                {branches.length}
                            </h2>

                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="stat-icon">
                            🛏️
                        </div>

                        <div>

                            <p>
                                Total Rooms
                            </p>

                            <h2>
                                {rooms.length}
                            </h2>

                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="stat-icon">
                            🏠
                        </div>

                        <div>

                            <p>
                                Room Types
                            </p>

                            <h2>
                                {roomTypes.length}
                            </h2>

                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="stat-icon">
                            ✅
                        </div>

                        <div>

                            <p>
                                Available Rooms
                            </p>

                            <h2>
                                {
                                    rooms.filter(
                                        room =>
                                            room.availableBeds > 0
                                    ).length
                                }
                            </h2>

                        </div>

                    </div>

                </section>


                {/* ========================================
                    MANAGEMENT OPTIONS
                ======================================== */}

                <section className="admin-management">

                    <h2>
                        Management
                    </h2>

                    <p className="section-description">
                        Manage hostel resources and
                        availability.
                    </p>


                    <div className="management-grid">


                        {/* BRANCHES */}

                        <div className="management-card">

                            <div className="management-icon">
                                🏢
                            </div>

                            <h3>
                                Branch Management
                            </h3>

                            <p>
                                Add and manage hostel
                                branches and locations.
                            </p>

                            <button
                                onClick={() =>
                                    alert(
                                        "Branch Management will be added next."
                                    )
                                }
                            >
                                Manage Branches
                            </button>

                        </div>


                        {/* ROOM TYPES */}

                        <div className="management-card">

                            <div className="management-icon">
                                🏠
                            </div>

                            <h3>
                                Room Type Management
                            </h3>

                            <p>
                                Manage room categories,
                                capacity and monthly rent.
                            </p>

                            <button
                                onClick={() =>
                                    alert(
                                        "Room Type Management will be added next."
                                    )
                                }
                            >
                                Manage Room Types
                            </button>

                        </div>


                        {/* ROOMS */}

                        <div className="management-card">

                            <div className="management-icon">
                                🛏️
                            </div>

                            <h3>
                                Room Management
                            </h3>

                            <p>
                                Add rooms and update bed
                                availability.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/admin/rooms"
                                    )
                                }
                            >
                                Manage Rooms
                            </button>

                        </div>


                        {/* BOOKINGS */}

                        <div className="management-card">

                            <div className="management-icon">
                                📋
                            </div>

                            <h3>
                                Booking Management
                            </h3>

                            <p>
                                View and manage student
                                room bookings.
                            </p>

                            <button
                                onClick={() =>
                                    alert(
                                        "Booking Management will be added next."
                                    )
                                }
                            >
                                Manage Bookings
                            </button>

                        </div>

                    </div>

                </section>


                {/* ========================================
                    ROOM OVERVIEW
                ======================================== */}

                <section className="admin-room-overview">

                    <div className="section-heading">

                        <div>

                            <h2>
                                Room Overview
                            </h2>

                            <p>
                                Current room availability
                                across all branches.
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/rooms"
                                )
                            }
                        >
                            Manage All Rooms
                        </button>

                    </div>


                    {rooms.length === 0 ? (

                        <div className="empty-admin-state">

                            <h3>
                                No rooms available
                            </h3>

                            <p>
                                Start by adding rooms
                                to your hostel branches.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-room-table-wrapper">

                            <table className="admin-room-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Room
                                        </th>

                                        <th>
                                            Branch
                                        </th>

                                        <th>
                                            Room Type
                                        </th>

                                        <th>
                                            Total Beds
                                        </th>

                                        <th>
                                            Available
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {rooms
                                        .slice(0, 10)
                                        .map(
                                            (room) => (

                                                <tr
                                                    key={
                                                        room._id
                                                    }
                                                >

                                                    <td>
                                                        <strong>
                                                            {
                                                                room.roomNumber
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {
                                                            room.branch?.name ||
                                                            "N/A"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            room.roomType?.name ||
                                                            "N/A"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            room.totalBeds
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            room.availableBeds
                                                        }
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                room.availableBeds >
                                                                0
                                                                    ? "status-available"
                                                                    : "status-full"
                                                            }
                                                        >

                                                            {
                                                                room.availableBeds >
                                                                0
                                                                    ? "Available"
                                                                    : "Fully Occupied"
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

            </main>

        </div>

    );

}

export default AdminDashboard;