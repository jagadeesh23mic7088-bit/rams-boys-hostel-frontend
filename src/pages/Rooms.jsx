import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getBranches,
    getRoomTypes,
    getRooms
} from "../services/api";

import "./Rooms.css";

function Rooms() {

    const [branches, setBranches] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [selectedBranch, setSelectedBranch] = useState("all");
    const [selectedRoomType, setSelectedRoomType] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    branchesResponse,
                    roomTypesResponse,
                    roomsResponse
                ] = await Promise.all([
                    getBranches(),
                    getRoomTypes(),
                    getRooms()
                ]);


                console.log(
                    "Branches:",
                    branchesResponse
                );

                console.log(
                    "Room Types:",
                    roomTypesResponse
                );

                console.log(
                    "Rooms:",
                    roomsResponse
                );


                // BRANCHES

                if (branchesResponse?.branches) {

                    setBranches(
                        branchesResponse.branches
                    );

                }


                // ROOM TYPES

                if (roomTypesResponse?.roomTypes) {

                    setRoomTypes(
                        roomTypesResponse.roomTypes
                    );

                }


                // ROOMS

                if (roomsResponse?.rooms) {

                    setRooms(
                        roomsResponse.rooms
                    );

                }

            } catch (err) {

                console.error(
                    "Room Loading Error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load available rooms."
                );

            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, []);


    // =========================================================
    // FILTER ROOMS
    // =========================================================

    const filteredRooms = rooms.filter(
        (room) => {

            const branchId =
                room.branch?._id ||
                room.branch;


            const roomTypeId =
                room.roomType?._id ||
                room.roomType;


            const branchMatch =
                selectedBranch === "all" ||
                branchId === selectedBranch;


            const roomTypeMatch =
                selectedRoomType === "all" ||
                roomTypeId === selectedRoomType;


            return (
                branchMatch &&
                roomTypeMatch
            );

        }
    );


    // =========================================================
    // BOOK ROOM
    // =========================================================

    const handleBookRoom = (room) => {

        console.log(
            "Selected Room:",
            room
        );


        const selectedRoom = {

            ...room,

            roomNumber:
                room.roomNumber,

            branch:
                room.branch,

            roomType:
                room.roomType,

            totalBeds:
                room.totalBeds,

            availableBeds:
                room.availableBeds

        };


        /*
        IMPORTANT:

        This keeps your existing booking flow.

        Rooms
          ↓
        Booking
          ↓
        ₹1,500 Advance Payment
          ↓
        QR / UPI
          ↓
        Confirmation
        */

        navigate(
            "/booking",
            {
                state: {
                    room: selectedRoom
                }
            }
        );

    };


    // =========================================================
    // LOADING SCREEN
    // =========================================================

    if (loading) {

        return (

            <div className="rooms-page">

                <div className="rooms-loading">

                    <div className="loading-spinner">
                    </div>

                    <h2>
                        Finding Available Rooms
                    </h2>

                    <p>
                        Please wait while we load
                        the latest room availability.
                    </p>

                </div>

            </div>

        );

    }


    // =========================================================
    // ERROR SCREEN
    // =========================================================

    if (error) {

        return (

            <div className="rooms-page">

                <div className="rooms-error">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Unable to Load Rooms
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="retry-button"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    // =========================================================
    // MAIN PAGE
    // =========================================================

    return (

        <div className="rooms-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="rooms-header">

                <div className="rooms-header-inner">


                    {/* BRAND */}

                    <div className="rooms-brand">

                        <div className="rooms-brand-logo">
                            RB
                        </div>

                        <div>

                            <strong>
                                RAMS BOYS HOSTEL
                            </strong>

                            <span>
                                STUDENT ACCOMMODATION
                            </span>

                        </div>

                    </div>


                    {/* DASHBOARD BUTTON */}

                    <button
                        className="dashboard-button"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    >

                        <span className="button-icon">
                            ←
                        </span>

                        <span>
                            Student Dashboard
                        </span>

                    </button>

                </div>


                {/* =================================================
                    HERO
                ================================================= */}

                <div className="rooms-hero">

                    <div className="hero-content">

                        <span className="hero-eyebrow">
                            ✦ RAMS STUDENT ACCOMMODATION
                        </span>

                        <h1>
                            Find Your Perfect Room
                        </h1>

                        <p>
                            Comfortable accommodation designed
                            to make your student life easier,
                            safer, and more convenient.
                        </p>

                    </div>


                    {/* HERO DECORATION */}

                    <div className="hero-decoration">

                        <div
                            className="
                                hero-circle
                                hero-circle-one
                            "
                        >
                        </div>

                        <div
                            className="
                                hero-circle
                                hero-circle-two
                            "
                        >
                        </div>

                        <div className="hero-house">
                            🏠
                        </div>

                    </div>

                </div>

            </header>


            {/* =================================================
                FILTER SECTION
            ================================================= */}

            <section className="filter-section">

                <div className="filter-card">


                    {/* FILTER HEADING */}

                    <div className="filter-heading">

                        <div className="filter-heading-icon">
                            ⚙
                        </div>

                        <div>

                            <span>
                                FIND YOUR ROOM
                            </span>

                            <h2>
                                Choose Your Preferences
                            </h2>

                        </div>

                    </div>


                    {/* FILTERS */}

                    <div className="filters">


                        {/* BRANCH */}

                        <div className="filter-group">

                            <label>

                                <span className="filter-label-icon">
                                    🏢
                                </span>

                                HOSTEL BRANCH

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

                                <option value="all">
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

                                            {branch.name}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* ROOM TYPE */}

                        <div className="filter-group">

                            <label>

                                <span className="filter-label-icon">
                                    🛏
                                </span>

                                ROOM TYPE

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

                                <option value="all">
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

                                            {roomType.name}
                                            {" • "}
                                            {roomType.category}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* CLEAR FILTERS */}

                        {(selectedBranch !== "all" ||
                            selectedRoomType !== "all") && (

                            <button
                                className="
                                    clear-filter-button
                                "
                                onClick={() => {

                                    setSelectedBranch(
                                        "all"
                                    );

                                    setSelectedRoomType(
                                        "all"
                                    );

                                }}
                            >

                                Clear Filters

                            </button>

                        )}

                    </div>

                </div>

            </section>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="rooms-container">


                {/* SECTION HEADER */}

                <div className="rooms-section-header">

                    <div>

                        <span className="section-eyebrow">
                            ACCOMMODATION
                        </span>

                        <h2>
                            Available Rooms
                        </h2>

                        <p>
                            Choose from our currently
                            available hostel rooms.
                        </p>

                    </div>


                    {/* ROOM COUNT */}

                    <div className="room-count-card">

                        <div className="room-count-icon">
                            🏠
                        </div>

                        <div>

                            <strong>
                                {filteredRooms.length}
                            </strong>

                            <span>
                                {filteredRooms.length === 1
                                    ? "Room Available"
                                    : "Rooms Available"
                                }
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    NO ROOMS
                ================================================= */}

                {filteredRooms.length === 0 ? (

                    <div className="empty-rooms">

                        <div className="empty-room-icon">
                            🏠
                        </div>

                        <h3>
                            No Rooms Available
                        </h3>

                        <p>
                            No rooms match your selected
                            preferences at the moment.
                        </p>

                        <button
                            className="
                                primary-action-button
                            "
                            onClick={() => {

                                setSelectedBranch(
                                    "all"
                                );

                                setSelectedRoomType(
                                    "all"
                                );

                            }}
                        >

                            Clear Filters

                            <span>
                                →
                            </span>

                        </button>

                    </div>

                ) : (


                    /* =================================================
                        ROOM GRID
                    ================================================= */

                    <div className="rooms-grid">

                        {filteredRooms.map(
                            (room) => {


                                const availableBeds =
                                    room.availableBeds ||
                                    0;


                                const totalBeds =
                                    room.totalBeds ||
                                    0;


                                const availabilityPercentage =
                                    totalBeds > 0
                                        ? (
                                            availableBeds /
                                            totalBeds
                                        ) * 100
                                        : 0;


                                const isAvailable =
                                    availableBeds > 0;


                                const isLimited =
                                    availableBeds > 0 &&
                                    availableBeds <= 1;


                                const roomCategory =
                                    room.roomType?.category ||
                                    "STANDARD";


                                const roomName =
                                    room.roomType?.name ||
                                    "Room";


                                const branchName =
                                    room.branch?.name ||
                                    "Not Available";


                                const monthlyRent =
                                    room.roomType?.monthlyRent ||
                                    0;


                                return (

                                    <div
                                        className="room-card"
                                        key={
                                            room._id
                                        }
                                    >


                                        {/* CARD TOP */}

                                        <div className="room-card-top">


                                            {/* ROOM NUMBER */}

                                            <div className="room-number">

                                                <span>
                                                    ROOM NUMBER
                                                </span>

                                                <strong>
                                                    {
                                                        room.roomNumber
                                                    }
                                                </strong>

                                            </div>


                                            {/* STATUS */}

                                            <span
                                                className={`
                                                    room-status
                                                    ${
                                                        isAvailable
                                                            ? "available"
                                                            : "full"
                                                    }
                                                `}
                                            >

                                                <span
                                                    className="
                                                        status-dot
                                                    "
                                                >
                                                </span>

                                                {isAvailable
                                                    ? "Available"
                                                    : "Fully Occupied"
                                                }

                                            </span>

                                        </div>


                                        {/* =================================================
                                            ROOM CATEGORY
                                        ================================================= */}

                                        <div className="room-category">


                                            <div className="category-icon">

                                                {roomCategory
                                                    .toLowerCase()
                                                    .includes("ac")
                                                    ? "❄"
                                                    : "☀"
                                                }

                                            </div>


                                            <div>

                                                <span>
                                                    ACCOMMODATION TYPE
                                                </span>

                                                <strong>

                                                    {roomCategory}

                                                    {" • "}

                                                    {roomName}

                                                </strong>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            ROOM DETAILS
                                        ================================================= */}

                                        <div className="room-details-grid">


                                            {/* BRANCH */}

                                            <div className="room-detail-item">

                                                <span>
                                                    🏢 BRANCH
                                                </span>

                                                <strong>
                                                    {
                                                        branchName
                                                    }
                                                </strong>

                                            </div>


                                            {/* CAPACITY */}

                                            <div className="room-detail-item">

                                                <span>
                                                    👥 CAPACITY
                                                </span>

                                                <strong>
                                                    {
                                                        totalBeds
                                                    } Beds
                                                </strong>

                                            </div>


                                            {/* AVAILABLE */}

                                            <div className="room-detail-item">

                                                <span>
                                                    🛏 AVAILABLE
                                                </span>

                                                <strong
                                                    className="
                                                        available-beds
                                                    "
                                                >
                                                    {
                                                        availableBeds
                                                    } Beds
                                                </strong>

                                            </div>


                                            {/* ROOM TYPE */}

                                            <div className="room-detail-item">

                                                <span>
                                                    🏠 ROOM TYPE
                                                </span>

                                                <strong>
                                                    {
                                                        roomName
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* DIVIDER */}

                                        <div className="room-divider">
                                        </div>


                                        {/* =================================================
                                            RENT
                                        ================================================= */}

                                        <div className="rent-section">

                                            <div>

                                                <span>
                                                    MONTHLY RENT
                                                </span>

                                                <strong>
                                                    ₹
                                                    {monthlyRent.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>

                                            <span className="rent-period">
                                                / month
                                            </span>

                                        </div>


                                        {/* =================================================
                                            AVAILABILITY
                                        ================================================= */}

                                        <div className="availability-section">


                                            <div className="availability-header">

                                                <span>
                                                    Bed Availability
                                                </span>

                                                <strong>
                                                    {
                                                        availableBeds
                                                    }
                                                    {" "}
                                                    of
                                                    {" "}
                                                    {
                                                        totalBeds
                                                    }
                                                </strong>

                                            </div>


                                            <div className="availability-bar">

                                                <div
                                                    className={`
                                                        availability-fill
                                                        ${
                                                            availabilityPercentage <= 25
                                                                ? "low"
                                                                : ""
                                                        }
                                                    `}
                                                    style={{
                                                        width:
                                                            `${availabilityPercentage}%`
                                                    }}
                                                >
                                                </div>

                                            </div>


                                            {isLimited && (

                                                <span className="limited-text">

                                                    Only {
                                                        availableBeds
                                                    } bed left.
                                                    Book soon!

                                                </span>

                                            )}

                                        </div>


                                        {/* =================================================
                                            BOOK BUTTON
                                        ================================================= */}

                                        <button
                                            className="
                                                book-room-button
                                            "
                                            disabled={
                                                !isAvailable
                                            }
                                            onClick={() =>
                                                handleBookRoom(
                                                    room
                                                )
                                            }
                                        >

                                            <span className="book-icon">
                                                ✓
                                            </span>

                                            {isAvailable
                                                ? "Book This Room"
                                                : "Currently Full"
                                            }

                                            {isAvailable && (

                                                <span className="book-arrow">
                                                    →
                                                </span>

                                            )}

                                        </button>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </main>


            {/* =================================================
                INFORMATION SECTION
            ================================================= */}

            <section className="rooms-info-section">

                <div className="rooms-info-card">

                    <div className="info-card-icon">
                        ℹ
                    </div>

                    <div>

                        <strong>
                            Real-Time Room Availability
                        </strong>

                        <p>
                            Room availability is updated
                            in real time based on hostel
                            management records. Select
                            an available room to begin
                            your reservation.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="rooms-footer">


                <div className="footer-brand">

                    <div className="footer-logo">
                        RB
                    </div>

                    <div>

                        <strong>
                            RAMS BOYS HOSTEL
                        </strong>

                        <span>
                            Comfortable. Secure. Convenient.
                        </span>

                    </div>

                </div>


                <p>
                    © 2026 RAMS BOYS HOSTEL.
                    All rights reserved.
                </p>


                <p>
                    Student Portal
                </p>

            </footer>

        </div>

    );

}

export default Rooms;