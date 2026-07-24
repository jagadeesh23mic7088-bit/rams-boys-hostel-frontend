import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getBranches,
    getRoomTypes,
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom
} from "../services/api";

function AdminRooms() {

    const navigate = useNavigate();

    // =====================================================
    // DATA STATE
    // =====================================================

    const [branches, setBranches] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [rooms, setRooms] = useState([]);

    // =====================================================
    // FILTER STATE
    // =====================================================

    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedRoomType, setSelectedRoomType] = useState("");

    // =====================================================
    // LOADING / ERROR STATE
    // =====================================================

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // ADD ROOM MODAL STATE
    // =====================================================

    const [showAddRoom, setShowAddRoom] = useState(false);

    const [roomForm, setRoomForm] = useState({
        branch: "",
        roomType: "",
        roomNumber: "",
        totalBeds: "",
        availableBeds: "",
        status: "Available"
    });

    const [creatingRoom, setCreatingRoom] = useState(false);

    const [formError, setFormError] = useState("");

    // =====================================================
    // EDIT ROOM MODAL STATE
    // =====================================================

    const [showEditRoom, setShowEditRoom] = useState(false);

    const [editingRoomId, setEditingRoomId] = useState("");

    const [editRoomForm, setEditRoomForm] = useState({
        roomNumber: "",
        totalBeds: "",
        availableBeds: "",
        status: "Available"
    });

    const [updatingRoom, setUpdatingRoom] = useState(false);

    const [editFormError, setEditFormError] = useState("");

    // =====================================================
    // DELETE STATE
    // =====================================================

    const [deletingRoomId, setDeletingRoomId] = useState("");

    // =====================================================
    // LOAD ALL DATA
    // =====================================================

    const loadData = async () => {

        try {

            setLoading(true);

            setError("");

            const branchResponse =
                await getBranches();

            const roomTypeResponse =
                await getRoomTypes();

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
                "Unable to load room information."
            );

        } finally {

            setLoading(false);

        }

    };

    // =====================================================
    // LOAD DATA WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadData();

    }, []);

    // =====================================================
    // FILTER ROOMS
    // =====================================================

    const filteredRooms =
        rooms.filter(
            (room) => {

                const branchMatch =
                    !selectedBranch ||
                    room.branch?._id === selectedBranch;

                const roomTypeMatch =
                    !selectedRoomType ||
                    room.roomType?._id === selectedRoomType;

                return (
                    branchMatch &&
                    roomTypeMatch
                );

            }
        );

    // =====================================================
    // CALCULATE STATISTICS
    // =====================================================

    const totalRooms =
        filteredRooms.length;

    const totalBeds =
        filteredRooms.reduce(
            (total, room) => {

                return (
                    total +
                    Number(
                        room.totalBeds || 0
                    )
                );

            },
            0
        );

    const availableBeds =
        filteredRooms.reduce(
            (total, room) => {

                return (
                    total +
                    Number(
                        room.availableBeds || 0
                    )
                );

            },
            0
        );

    const occupiedBeds =
        totalBeds -
        availableBeds;

    // =====================================================
    // HANDLE ADD ROOM FORM INPUT
    // =====================================================

    const handleRoomFormChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setRoomForm(
            (previousForm) => ({
                ...previousForm,
                [name]: value
            })
        );

    };

    // =====================================================
    // OPEN ADD ROOM MODAL
    // =====================================================

    const openAddRoomForm = () => {

        setFormError("");

        setRoomForm({
            branch: "",
            roomType: "",
            roomNumber: "",
            totalBeds: "",
            availableBeds: "",
            status: "Available"
        });

        setShowAddRoom(true);

    };

    // =====================================================
    // CLOSE ADD ROOM MODAL
    // =====================================================

    const closeAddRoomForm = () => {

        if (creatingRoom) {

            return;

        }

        setShowAddRoom(false);

        setFormError("");

    };

    // =====================================================
    // CREATE NEW ROOM
    // =====================================================

    const handleCreateRoom = async (e) => {

        e.preventDefault();

        setFormError("");

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!roomForm.branch) {

            setFormError(
                "Please select a branch."
            );

            return;

        }

        if (!roomForm.roomType) {

            setFormError(
                "Please select a room type."
            );

            return;

        }

        if (!roomForm.roomNumber.trim()) {

            setFormError(
                "Please enter a room number."
            );

            return;

        }

        if (!roomForm.totalBeds) {

            setFormError(
                "Please enter total beds."
            );

            return;

        }

        if (
            roomForm.availableBeds === "" ||
            roomForm.availableBeds === null
        ) {

            setFormError(
                "Please enter available beds."
            );

            return;

        }

        const totalBeds =
            Number(
                roomForm.totalBeds
            );

        const availableBeds =
            Number(
                roomForm.availableBeds
            );

        if (totalBeds <= 0) {

            setFormError(
                "Total beds must be greater than 0."
            );

            return;

        }

        if (availableBeds < 0) {

            setFormError(
                "Available beds cannot be negative."
            );

            return;

        }

        if (availableBeds > totalBeds) {

            setFormError(
                "Available beds cannot be greater than total beds."
            );

            return;

        }

        try {

            setCreatingRoom(true);

            const roomData = {

                branch:
                    roomForm.branch,

                roomType:
                    roomForm.roomType,

                roomNumber:
                    roomForm.roomNumber.trim(),

                totalBeds:
                    totalBeds,

                availableBeds:
                    availableBeds,

                status:
                    roomForm.status

            };

            console.log(
                "Creating Room:",
                roomData
            );

            const response =
                await createRoom(
                    roomData
                );

            console.log(
                "Room Created:",
                response
            );

            setShowAddRoom(false);

            setRoomForm({
                branch: "",
                roomType: "",
                roomNumber: "",
                totalBeds: "",
                availableBeds: "",
                status: "Available"
            });

            await loadData();

            alert(
                "Room created successfully!"
            );

        } catch (error) {

            console.error(
                "Create Room Error:",
                error
            );

            setFormError(
                error.message ||
                "Unable to create room."
            );

        } finally {

            setCreatingRoom(false);

        }

    };

    // =====================================================
    // OPEN EDIT ROOM MODAL
    // =====================================================

    const openEditRoomForm = (room) => {

        setEditFormError("");

        setEditingRoomId(
            room._id
        );

        setEditRoomForm({

            roomNumber:
                room.roomNumber || "",

            totalBeds:
                room.totalBeds || "",

            availableBeds:
                room.availableBeds || "",

            status:
                room.status || "Available"

        });

        setShowEditRoom(true);

    };

    // =====================================================
    // CLOSE EDIT ROOM MODAL
    // =====================================================

    const closeEditRoomForm = () => {

        if (updatingRoom) {

            return;

        }

        setShowEditRoom(false);

        setEditingRoomId("");

        setEditFormError("");

    };

    // =====================================================
    // HANDLE EDIT FORM INPUT
    // =====================================================

    const handleEditRoomFormChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setEditRoomForm(
            (previousForm) => ({

                ...previousForm,

                [name]:
                    value

            })
        );

    };

    // =====================================================
    // UPDATE ROOM
    // =====================================================

    const handleUpdateRoom = async (e) => {

        e.preventDefault();

        setEditFormError("");

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (
            !editRoomForm.roomNumber.trim()
        ) {

            setEditFormError(
                "Please enter a room number."
            );

            return;

        }

        if (
            editRoomForm.totalBeds === ""
        ) {

            setEditFormError(
                "Please enter total beds."
            );

            return;

        }

        if (
            editRoomForm.availableBeds === ""
        ) {

            setEditFormError(
                "Please enter available beds."
            );

            return;

        }

        const totalBeds =
            Number(
                editRoomForm.totalBeds
            );

        const availableBeds =
            Number(
                editRoomForm.availableBeds
            );

        if (totalBeds <= 0) {

            setEditFormError(
                "Total beds must be greater than 0."
            );

            return;

        }

        if (availableBeds < 0) {

            setEditFormError(
                "Available beds cannot be negative."
            );

            return;

        }

        if (
            availableBeds >
            totalBeds
        ) {

            setEditFormError(
                "Available beds cannot be greater than total beds."
            );

            return;

        }

        try {

            setUpdatingRoom(true);

            const roomData = {

                roomNumber:
                    editRoomForm.roomNumber.trim(),

                totalBeds:
                    totalBeds,

                availableBeds:
                    availableBeds,

                status:
                    editRoomForm.status

            };

            console.log(
                "Updating Room:",
                editingRoomId,
                roomData
            );

            const response =
                await updateRoom(
                    editingRoomId,
                    roomData
                );

            console.log(
                "Room Updated:",
                response
            );

            setShowEditRoom(false);

            setEditingRoomId("");

            await loadData();

            alert(
                "Room updated successfully!"
            );

        } catch (error) {

            console.error(
                "Update Room Error:",
                error
            );

            setEditFormError(
                error.message ||
                "Unable to update room."
            );

        } finally {

            setUpdatingRoom(false);

        }

    };

    // =====================================================
    // DELETE ROOM
    // =====================================================

    const handleDeleteRoom = async (room) => {

        const confirmDelete =
            window.confirm(
                `Are you sure you want to delete Room ${room.roomNumber}?`
            );

        if (!confirmDelete) {

            return;

        }

        try {

            setDeletingRoomId(
                room._id
            );

            console.log(
                "Deleting Room:",
                room._id
            );

            const response =
                await deleteRoom(
                    room._id
                );

            console.log(
                "Room Deleted:",
                response
            );

            await loadData();

            alert(
                "Room deleted successfully!"
            );

        } catch (error) {

            console.error(
                "Delete Room Error:",
                error
            );

            alert(
                error.message ||
                "Unable to delete room."
            );

        } finally {

            setDeletingRoomId("");

        }

    };

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
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

            <div className="admin-dashboard-page">

                <div className="admin-loading">

                    <div className="loading-icon">
                        🏨
                    </div>

                    <h2>
                        Loading Room Management
                    </h2>

                    <p>
                        Please wait while we load
                        hostel room information.
                    </p>

                </div>

            </div>

        );

    }

    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="admin-dashboard-page">

            {/* =================================================
                ADMIN NAVBAR
            ================================================= */}

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
                            navigate(
                                "/admin/dashboard"
                            )
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
                        onClick={
                            handleLogout
                        }
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="admin-main-container">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <section className="admin-header">

                    <p className="admin-label">
                        ROOM MANAGEMENT
                    </p>

                    <h1>
                        Manage Hostel Rooms
                    </h1>

                    <p>
                        View and manage room availability,
                        bed capacity and accommodation
                        inventory across all RAMS Boys
                        Hostel branches.
                    </p>

                </section>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="admin-error">

                        <h3>
                            Unable to Load Rooms
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={
                                loadData
                            }
                        >
                            Try Again
                        </button>

                    </div>

                )}

                {/* =================================================
                    FILTER SECTION
                ================================================= */}

                <section className="admin-filter-section">

                    <div className="filter-group">

                        <label>
                            Select Branch
                        </label>

                        <select
                            value={
                                selectedBranch
                            }
                            onChange={(e) =>
                                setSelectedBranch(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                All Branches
                            </option>

                            {branches.map(
                                (branch) => (

                                    <option
                                        key={
                                            branch._id
                                        }
                                        value={
                                            branch._id
                                        }
                                    >
                                        {
                                            branch.name
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    <div className="filter-group">

                        <label>
                            Select Room Type
                        </label>

                        <select
                            value={
                                selectedRoomType
                            }
                            onChange={(e) =>
                                setSelectedRoomType(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                All Room Types
                            </option>

                            {roomTypes.map(
                                (roomType) => (

                                    <option
                                        key={
                                            roomType._id
                                        }
                                        value={
                                            roomType._id
                                        }
                                    >
                                        {
                                            roomType.name
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    <div className="filter-actions">

                        <button
                            onClick={() => {

                                setSelectedBranch("");

                                setSelectedRoomType("");

                            }}
                        >
                            Clear Filters
                        </button>

                    </div>

                </section>

                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section className="admin-statistics">

                    <div className="admin-stat-card">

                        <div className="stat-icon">
                            🏢
                        </div>

                        <div>

                            <p>
                                Total Rooms
                            </p>

                            <h2>
                                {totalRooms}
                            </h2>

                        </div>

                    </div>

                    <div className="admin-stat-card">

                        <div className="stat-icon">
                            🛏️
                        </div>

                        <div>

                            <p>
                                Total Beds
                            </p>

                            <h2>
                                {totalBeds}
                            </h2>

                        </div>

                    </div>

                    <div className="admin-stat-card">

                        <div className="stat-icon">
                            ✅
                        </div>

                        <div>

                            <p>
                                Available Beds
                            </p>

                            <h2>
                                {availableBeds}
                            </h2>

                        </div>

                    </div>

                    <div className="admin-stat-card">

                        <div className="stat-icon">
                            👥
                        </div>

                        <div>

                            <p>
                                Occupied Beds
                            </p>

                            <h2>
                                {occupiedBeds}
                            </h2>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    ROOM INVENTORY
                ================================================= */}

                <section className="admin-room-overview">

                    <div className="section-heading">

                        <div>

                            <p className="admin-label">
                                ACCOMMODATION INVENTORY
                            </p>

                            <h2>
                                Room Inventory
                            </h2>

                            <p>
                                Monitor current room and
                                bed availability across
                                hostel branches.
                            </p>

                        </div>

                    </div>

                    {filteredRooms.length === 0 ? (

                        <div className="empty-admin-state">

                            <div className="empty-icon">
                                🏨
                            </div>

                            <h3>
                                No Rooms Found
                            </h3>

                            <p>
                                No rooms match the selected
                                branch or room type.
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
                                                        room.roomType?.category ||
                                                        "N/A"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        room.totalBeds
                                                    }
                                                </td>

                                                <td>

                                                    <strong>
                                                        {
                                                            room.availableBeds
                                                        }
                                                    </strong>

                                                </td>

                                                <td>

                                                    ₹
                                                    {
                                                        Number(
                                                            room.roomType?.monthlyRent ||
                                                            0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )
                                                    }

                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            room.status ===
                                                            "Available"
                                                                ? "status-available"
                                                                : room.status ===
                                                                  "Maintenance"
                                                                ? "status-maintenance"
                                                                : room.status ===
                                                                  "Partially Occupied"
                                                                ? "status-partial"
                                                                : "status-full"
                                                        }
                                                    >
                                                        {
                                                            room.status ||
                                                            "Unknown"
                                                        }
                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="room-action-buttons">

                                                        <button
                                                            className="edit-room-button"
                                                            onClick={() =>
                                                                openEditRoomForm(
                                                                    room
                                                                )
                                                            }
                                                        >
                                                            ✏️ Edit
                                                        </button>

                                                        <button
                                                            className="delete-room-button"
                                                            onClick={() =>
                                                                handleDeleteRoom(
                                                                    room
                                                                )
                                                            }
                                                            disabled={
                                                                deletingRoomId ===
                                                                room._id
                                                            }
                                                        >

                                                            {deletingRoomId ===
                                                            room._id
                                                                ? "Deleting..."
                                                                : "🗑️ Delete"
                                                            }

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

                {/* =================================================
                    ROOM ADMINISTRATION
                ================================================= */}

                <section className="admin-management">

                    <p className="admin-label">
                        ADMINISTRATION
                    </p>

                    <h2>
                        Room Administration
                    </h2>

                    <p className="section-description">
                        Manage your hostel inventory by
                        adding, editing or deleting rooms.
                    </p>

                    <div className="management-grid">

                        {/* ADD ROOM */}

                        <div className="management-card">

                            <div className="management-icon">
                                ➕
                            </div>

                            <h3>
                                Add New Room
                            </h3>

                            <p>
                                Create a new room, select its
                                branch and room type, and define
                                the total and available beds.
                            </p>

                            <button
                                onClick={
                                    openAddRoomForm
                                }
                            >
                                Add Room
                            </button>

                        </div>

                        {/* EDIT ROOM */}

                        <div className="management-card">

                            <div className="management-icon">
                                ✏️
                            </div>

                            <h3>
                                Edit Existing Room
                            </h3>

                            <p>
                                Select the Edit button from
                                any room in the inventory table
                                to update room information.
                            </p>

                            <button
                                onClick={() =>
                                    document
                                        .querySelector(
                                            ".admin-room-table-wrapper"
                                        )
                                        ?.scrollIntoView({
                                            behavior:
                                                "smooth"
                                        })
                                }
                            >
                                View Rooms
                            </button>

                        </div>

                    </div>

                </section>

            </main>

            {/* =================================================
                ADD ROOM MODAL
            ================================================= */}

            {showAddRoom && (

                <div className="room-modal-overlay">

                    <div className="room-modal">

                        <div className="room-modal-header">

                            <div>

                                <p className="admin-label">
                                    ROOM ADMINISTRATION
                                </p>

                                <h2>
                                    Add New Room
                                </h2>

                            </div>

                            <button
                                className="modal-close-button"
                                onClick={
                                    closeAddRoomForm
                                }
                                disabled={
                                    creatingRoom
                                }
                            >
                                ✕
                            </button>

                        </div>

                        {formError && (

                            <div className="admin-error">

                                <p>
                                    {formError}
                                </p>

                            </div>

                        )}

                        <form
                            onSubmit={
                                handleCreateRoom
                            }
                        >

                            {/* BRANCH */}

                            <div className="modal-form-group">

                                <label>
                                    Select Branch
                                </label>

                                <select
                                    name="branch"
                                    value={
                                        roomForm.branch
                                    }
                                    onChange={
                                        handleRoomFormChange
                                    }
                                    disabled={
                                        creatingRoom
                                    }
                                >

                                    <option value="">
                                        Select Branch
                                    </option>

                                    {branches.map(
                                        (branch) => (

                                            <option
                                                key={
                                                    branch._id
                                                }
                                                value={
                                                    branch._id
                                                }
                                            >
                                                {
                                                    branch.name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* ROOM TYPE */}

                            <div className="modal-form-group">

                                <label>
                                    Select Room Type
                                </label>

                                <select
                                    name="roomType"
                                    value={
                                        roomForm.roomType
                                    }
                                    onChange={
                                        handleRoomFormChange
                                    }
                                    disabled={
                                        creatingRoom
                                    }
                                >

                                    <option value="">
                                        Select Room Type
                                    </option>

                                    {roomTypes.map(
                                        (roomType) => (

                                            <option
                                                key={
                                                    roomType._id
                                                }
                                                value={
                                                    roomType._id
                                                }
                                            >

                                                {
                                                    roomType.name
                                                }

                                                {" - ₹"}

                                                {
                                                    Number(
                                                        roomType.monthlyRent ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* ROOM NUMBER */}

                            <div className="modal-form-group">

                                <label>
                                    Room Number
                                </label>

                                <input
                                    type="text"
                                    name="roomNumber"
                                    placeholder="Example: 101"
                                    value={
                                        roomForm.roomNumber
                                    }
                                    onChange={
                                        handleRoomFormChange
                                    }
                                    disabled={
                                        creatingRoom
                                    }
                                />

                            </div>

                            {/* BED INFORMATION */}

                            <div className="modal-two-columns">

                                <div className="modal-form-group">

                                    <label>
                                        Total Beds
                                    </label>

                                    <input
                                        type="number"
                                        name="totalBeds"
                                        min="1"
                                        placeholder="Example: 4"
                                        value={
                                            roomForm.totalBeds
                                        }
                                        onChange={
                                            handleRoomFormChange
                                        }
                                        disabled={
                                            creatingRoom
                                        }
                                    />

                                </div>

                                <div className="modal-form-group">

                                    <label>
                                        Available Beds
                                    </label>

                                    <input
                                        type="number"
                                        name="availableBeds"
                                        min="0"
                                        placeholder="Example: 4"
                                        value={
                                            roomForm.availableBeds
                                        }
                                        onChange={
                                            handleRoomFormChange
                                        }
                                        disabled={
                                            creatingRoom
                                        }
                                    />

                                </div>

                            </div>

                            {/* STATUS */}

                            <div className="modal-form-group">

                                <label>
                                    Room Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        roomForm.status
                                    }
                                    onChange={
                                        handleRoomFormChange
                                    }
                                    disabled={
                                        creatingRoom
                                    }
                                >

                                    <option value="Available">
                                        Available
                                    </option>

                                    <option value="Partially Occupied">
                                        Partially Occupied
                                    </option>

                                    <option value="Full">
                                        Full
                                    </option>

                                    <option value="Maintenance">
                                        Maintenance
                                    </option>

                                </select>

                            </div>

                            {/* ACTIONS */}

                            <div className="room-modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel-button"
                                    onClick={
                                        closeAddRoomForm
                                    }
                                    disabled={
                                        creatingRoom
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="modal-create-button"
                                    disabled={
                                        creatingRoom
                                    }
                                >

                                    {creatingRoom
                                        ? "Creating Room..."
                                        : "Create Room"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =================================================
                EDIT ROOM MODAL
            ================================================= */}

            {showEditRoom && (

                <div className="room-modal-overlay">

                    <div className="room-modal">

                        <div className="room-modal-header">

                            <div>

                                <p className="admin-label">
                                    ROOM ADMINISTRATION
                                </p>

                                <h2>
                                    Edit Room
                                </h2>

                            </div>

                            <button
                                className="modal-close-button"
                                onClick={
                                    closeEditRoomForm
                                }
                                disabled={
                                    updatingRoom
                                }
                            >
                                ✕
                            </button>

                        </div>

                        {editFormError && (

                            <div className="admin-error">

                                <p>
                                    {editFormError}
                                </p>

                            </div>

                        )}

                        <form
                            onSubmit={
                                handleUpdateRoom
                            }
                        >

                            {/* ROOM NUMBER */}

                            <div className="modal-form-group">

                                <label>
                                    Room Number
                                </label>

                                <input
                                    type="text"
                                    name="roomNumber"
                                    placeholder="Example: 101"
                                    value={
                                        editRoomForm.roomNumber
                                    }
                                    onChange={
                                        handleEditRoomFormChange
                                    }
                                    disabled={
                                        updatingRoom
                                    }
                                />

                            </div>

                            {/* BED INFORMATION */}

                            <div className="modal-two-columns">

                                <div className="modal-form-group">

                                    <label>
                                        Total Beds
                                    </label>

                                    <input
                                        type="number"
                                        name="totalBeds"
                                        min="1"
                                        value={
                                            editRoomForm.totalBeds
                                        }
                                        onChange={
                                            handleEditRoomFormChange
                                        }
                                        disabled={
                                            updatingRoom
                                        }
                                    />

                                </div>

                                <div className="modal-form-group">

                                    <label>
                                        Available Beds
                                    </label>

                                    <input
                                        type="number"
                                        name="availableBeds"
                                        min="0"
                                        value={
                                            editRoomForm.availableBeds
                                        }
                                        onChange={
                                            handleEditRoomFormChange
                                        }
                                        disabled={
                                            updatingRoom
                                        }
                                    />

                                </div>

                            </div>

                            {/* STATUS */}

                            <div className="modal-form-group">

                                <label>
                                    Room Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        editRoomForm.status
                                    }
                                    onChange={
                                        handleEditRoomFormChange
                                    }
                                    disabled={
                                        updatingRoom
                                    }
                                >

                                    <option value="Available">
                                        Available
                                    </option>

                                    <option value="Partially Occupied">
                                        Partially Occupied
                                    </option>

                                    <option value="Full">
                                        Full
                                    </option>

                                    <option value="Maintenance">
                                        Maintenance
                                    </option>

                                </select>

                            </div>

                            {/* ACTIONS */}

                            <div className="room-modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel-button"
                                    onClick={
                                        closeEditRoomForm
                                    }
                                    disabled={
                                        updatingRoom
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="modal-create-button"
                                    disabled={
                                        updatingRoom
                                    }
                                >

                                    {updatingRoom
                                        ? "Updating Room..."
                                        : "Update Room"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}

export default AdminRooms;