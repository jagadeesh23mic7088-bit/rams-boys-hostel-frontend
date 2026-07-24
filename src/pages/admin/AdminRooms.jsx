import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getBranches,
    getRoomTypes,
    getRooms
} from "../services/api";

function AdminRooms() {

    const navigate = useNavigate();

    // ========================================
    // STATE
    // ========================================

    const [branches, setBranches] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [selectedBranch, setSelectedBranch] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ========================================
    // LOAD DATA
    // ========================================

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                branchResponse,
                roomTypeResponse,
                roomResponse
            ] = await Promise.all([
                getBranches(),
                getRoomTypes(),
                getRooms()
            ]);

            setBranches(
                branchResponse.branches || []
            );

            setRoomTypes(
                roomTypeResponse.roomTypes || []
            );

            setRooms(
                roomResponse.rooms || []
            );

        } catch (error) {

            console.error(
                "Admin Rooms Error:",
                error
            );

            setError(
                error.message ||
                "Unable to load room data"
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // LOAD DATA ON PAGE OPEN
    // ========================================

    useEffect(() => {

        loadData();

    }, []);


    // ========================================
    // FILTER ROOMS
    // ========================================

    const filteredRooms =
        selectedBranch === "all"
            ? rooms
            : rooms.filter(
                room =>
                    room.branch?._id ===
                    selectedBranch
            );


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
                        Loading Room Management...
                    </h2>

                    <p>
                        Please wait while we load the rooms.
                    </p>

                </div>

            </div>

        );

    }


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="admin-dashboard-page">

            {/* ========================================
                NAVBAR
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
                            navigate("/admin/dashboard")
                        }
                    >
                        Dashboard
                    </button>

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


                {/* ========================================
                    PAGE HEADER
                ======================================== */}

                <section className="admin-header">

                    <div>

                        <p className="admin-label">
                            ROOM MANAGEMENT
                        </p>

                        <h1>
                            Manage Hostel Rooms
                        </h1>

                        <p>
                            Add, update and manage room
                            availability across RAMS Boys Hostel.
                        </p>

                    </div>


                    <button
                        className="admin-primary-button"
                        onClick={() =>
                            alert(
                                "Add Room form will be added next."
                            )
                        }
                    >
                        + Add New Room
                    </button>

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


                    <div className="admin-stat-card">

                        <div className="stat-icon">
                            🔴
                        </div>

                        <div>

                            <p>
                                Full Rooms
                            </p>

                            <h2>
                                {
                                    rooms.filter(
                                        room =>
                                            room.availableBeds === 0
                                    ).length
                                }
                            </h2>

                        </div>

                    </div>

                </section>


                {/* ========================================
                    FILTER SECTION
                ======================================== */}

                <section className="admin-filter-section">

                    <div>

                        <label>
                            Filter by Branch
                        </label>

                        <select
                            value={selectedBranch}
                            onChange={(e) =>
                                setSelectedBranch(
                                    e.target.value
                                )
                            }
                        >

                            <option value="all">
                                All Branches
                            </option>

                            {branches.map(
                                branch => (

                                    <option
                                        key={branch._id}
                                        value={branch._id}
                                    >
                                        {branch.name}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    <div className="room-count">

                        Showing
                        {" "}
                        <strong>
                            {filteredRooms.length}
                        </strong>
                        {" "}
                        rooms

                    </div>

                </section>


                {/* ========================================
                    ERROR
                ======================================== */}

                {error && (

                    <div className="error-message">

                        {error}

                        <button
                            onClick={loadData}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* ========================================
                    ROOM TABLE
                ======================================== */}

                <section className="admin-room-overview">

                    <div className="section-heading">

                        <div>

                            <h2>
                                Room Inventory
                            </h2>

                            <p>
                                Manage all rooms and current
                                bed availability.
                            </p>

                        </div>

                    </div>


                    {filteredRooms.length === 0 ? (

                        <div className="empty-admin-state">

                            <div>
                                🛏️
                            </div>

                            <h3>
                                No rooms found
                            </h3>

                            <p>
                                There are currently no rooms
                                available for this branch.
                            </p>

                            <button
                                className="admin-primary-button"
                                onClick={() =>
                                    alert(
                                        "Add Room form will be added next."
                                    )
                                }
                            >
                                + Add First Room
                            </button>

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
                                            Category
                                        </th>

                                        <th>
                                            Total Beds
                                        </th>

                                        <th>
                                            Available
                                        </th>

                                        <th>
                                            Monthly Rent
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredRooms.map(
                                        room => (

                                            <tr
                                                key={
                                                    room._id
                                                }
                                            >

                                                {/* ROOM */}

                                                <td>

                                                    <strong>
                                                        {
                                                            room.roomNumber
                                                        }
                                                    </strong>

                                                </td>


                                                {/* BRANCH */}

                                                <td>

                                                    {
                                                        room.branch?.name ||
                                                        "N/A"
                                                    }

                                                </td>


                                                {/* ROOM TYPE */}

                                                <td>

                                                    {
                                                        room.roomType?.name ||
                                                        "N/A"
                                                    }

                                                </td>


                                                {/* CATEGORY */}

                                                <td>

                                                    {
                                                        room.roomType?.category ||
                                                        "N/A"
                                                    }

                                                </td>


                                                {/* TOTAL BEDS */}

                                                <td>

                                                    {
                                                        room.totalBeds
                                                    }

                                                </td>


                                                {/* AVAILABLE BEDS */}

                                                <td>

                                                    <strong>
                                                        {
                                                            room.availableBeds
                                                        }
                                                    </strong>

                                                </td>


                                                {/* RENT */}

                                                <td>

                                                    ₹
                                                    {
                                                        room.roomType?.monthlyRent ||
                                                        0
                                                    }

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={
                                                            room.availableBeds > 0
                                                                ? "status-available"
                                                                : "status-full"
                                                        }
                                                    >

                                                        {
                                                            room.availableBeds > 0
                                                                ? "Available"
                                                                : "Fully Occupied"
                                                        }

                                                    </span>

                                                </td>


                                                {/* ACTIONS */}

                                                <td>

                                                    <div className="admin-action-buttons">

                                                        <button
                                                            onClick={() =>
                                                                alert(
                                                                    "Edit Room feature will be added next."
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                alert(
                                                                    "Delete Room feature will be added next."
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

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

export default AdminRooms;