import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getBranches,
    getRoomTypes,
    getRooms
} from "../services/api";

import "./Rooms.css";

function Rooms() {

    const navigate = useNavigate();

    const [branches, setBranches] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [selectedBranch, setSelectedBranch] = useState("all");
    const [selectedRoomType, setSelectedRoomType] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD DATA
    // =====================================================

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


                // BRANCHES

                setBranches(
                    branchesResponse?.branches || []
                );


                // ROOM TYPES

                setRoomTypes(
                    roomTypesResponse?.roomTypes || []
                );


                // ROOMS

                setRooms(
                    roomsResponse?.rooms || []
                );


            } catch (error) {

                console.error(
                    "Room Loading Error:",
                    error
                );

                setError(
                    error?.message ||
                    "Unable to load available rooms."
                );

            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, []);


    // =====================================================
    // FILTER ROOMS
    // =====================================================

    const filteredRooms = rooms.filter((room) => {

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

    });


    // =====================================================
    // BOOK ROOM
    // =====================================================

    const handleBookRoom = (room) => {

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


        navigate(
            "/booking",
            {
                state: {
                    room: selectedRoom
                }
            }
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="rooms-page">

                <div className="rooms-loading">

                    <div className="loading-icon">
                        🏠
                    </div>

                    <div className="loading-spinner"></div>

                    <h2>
                        Finding Available Rooms
                    </h2>

                    <p>
                        Please wait while we load the
                        latest hostel availability.
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="rooms-page">

                <div className="rooms-error">

                    <div className="error-icon">
                        ⚠
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
                        ↻ Try Again
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN PAGE
    // =====================================================

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
                                RAMS BOYS
                            </strong>

                            <span>
                                HOSTEL
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

                        Student Dashboard

                    </button>

                </div>


                {/* HERO */}

                <div className="rooms-hero">

                    <div className="hero-content">

                        <span className="hero-eyebrow">
                            STUDENT ACCOMMODATION
                        </span>

                        <h1>
                            Find Your Perfect Room
                        </h1>

                        <p>
                            Explore comfortable and affordable
                            hostel accommodation designed to
                            make your student life easier.
                        </p>

                    </div>


                    <div className="hero-decoration">

                        <div className="hero-circle hero-circle-one">
                        </div>

                        <div className="hero-circle hero-circle-two">
                        </div>

                        <div className="hero-house">
                            🏠
                        </div>

                    </div>

                </div>

            </header>


            {/* =================================================
                FILTER BAR
            ================================================= */}

            <section className="filter-section">

                <div className="filter-card">


                    {/* FILTER TITLE */}

                    <div className="filter-heading">

                        <div className="filter-heading-icon">
                            ⚙
                        </div>

                        <div>

                            <span>
                                FIND YOUR ROOM
                            </span>

                            <h2>
                                Filter Accommodation
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

                                Hostel Branch
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
                                    (branch) => (

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


                        {/* ROOM TYPE */}

                        <div className="filter-group">

                            <label>
                                <span className="filter-label-icon">
                                    🛏
                                </span>

                                Room Accommodation
                            </label>

                            <select
                                value={selectedRoomType}
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
                                            key={roomType._id}
                                            value={roomType._id}
                                        >

                                            {roomType.name}

                                            {" - "}

                                            {roomType.category}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* CLEAR */}

                        {(selectedBranch !== "all" ||
                            selectedRoomType !== "all") && (

                            <button
                                className="clear-filter-button"
                                onClick={() => {

                                    setSelectedBranch(
                                        "all"
                                    );

                                    setSelectedRoomType(
                                        "all"
                                    );

                                }}
                            >
                                ✕ Clear Filters
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
                            Choose from our currently available
                            hostel rooms and reserve your preferred
                            accommodation.
                        </p>

                    </div>


                    {/* ROOM COUNT */}

                    <div className="room-count-card">

                        <div className="room-count-icon">
                            🛏
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
                            We couldn't find any rooms matching
                            your selected filters.
                        </p>

                        <button
                            className="primary-action-button"
                            onClick={() => {

                                setSelectedBranch(
                                    "all"
                                );

                                setSelectedRoomType(
                                    "all"
                                );

                            }}
                        >

                            View All Rooms

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
                                    Number(
                                        room.availableBeds || 0
                                    );


                                const totalBeds =
                                    Number(
                                        room.totalBeds || 0
                                    );


                                const availabilityPercentage =
                                    totalBeds > 0
                                        ? (
                                            availableBeds /
                                            totalBeds
                                        ) * 100
                                        : 0;


                                const isAvailable =
                                    availableBeds > 0;


                                const isLowAvailability =
                                    availableBeds > 0 &&
                                    availableBeds <= 1;


                                return (

                                    <article
                                        className="room-card"
                                        key={room._id}
                                    >


                                        {/* CARD TOP */}

                                        <div className="room-card-top">


                                            <div className="room-number">

                                                <span>
                                                    ROOM
                                                </span>

                                                <strong>
                                                    {room.roomNumber}
                                                </strong>

                                            </div>


                                            <span
                                                className={
                                                    isAvailable
                                                        ? "room-status available"
                                                        : "room-status full"
                                                }
                                            >

                                                <span className="status-dot">
                                                </span>

                                                {isAvailable
                                                    ? "Available"
                                                    : "Fully Occupied"
                                                }

                                            </span>

                                        </div>


                                        {/* ROOM CATEGORY */}

                                        <div className="room-category">

                                            <div className="category-icon">
                                                {room.roomType?.category
                                                    ?.toLowerCase()
                                                    .includes("ac")
                                                    ? "❄"
                                                    : "☀"
                                                }
                                            </div>

                                            <div>

                                                <span>
                                                    {room.roomType?.category ||
                                                        "STANDARD"
                                                    }
                                                </span>

                                                <strong>
                                                    {room.roomType?.name ||
                                                        "Room"
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* DETAILS */}

                                        <div className="room-details-grid">


                                            <div className="room-detail-item">

                                                <span>
                                                    🏢 Branch
                                                </span>

                                                <strong>
                                                    {room.branch?.name ||
                                                        "Not Available"
                                                    }
                                                </strong>

                                            </div>


                                            <div className="room-detail-item">

                                                <span>
                                                    🛏 Room Type
                                                </span>

                                                <strong>
                                                    {room.roomType?.name ||
                                                        "Not Available"
                                                    }
                                                </strong>

                                            </div>


                                            <div className="room-detail-item">

                                                <span>
                                                    👥 Total Beds
                                                </span>

                                                <strong>
                                                    {totalBeds}
                                                </strong>

                                            </div>


                                            <div className="room-detail-item">

                                                <span>
                                                    ✓ Available
                                                </span>

                                                <strong className="available-beds">
                                                    {availableBeds}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* DIVIDER */}

                                        <div className="room-divider">
                                        </div>


                                        {/* RENT */}

                                        <div className="rent-section">

                                            <div>

                                                <span>
                                                    MONTHLY RENT
                                                </span>

                                                <strong>

                                                    ₹
                                                    {Number(
                                                        room.roomType?.monthlyRent ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </strong>

                                            </div>

                                            <span className="rent-period">
                                                / month
                                            </span>

                                        </div>


                                        {/* AVAILABILITY */}

                                        <div className="availability-section">

                                            <div className="availability-header">

                                                <span>
                                                    Bed Availability
                                                </span>

                                                <strong>
                                                    {availableBeds}
                                                    {" "}
                                                    of
                                                    {" "}
                                                    {totalBeds}
                                                </strong>

                                            </div>


                                            <div className="availability-bar">

                                                <div
                                                    className={
                                                        isLowAvailability
                                                            ? "availability-fill low"
                                                            : "availability-fill"
                                                    }

                                                    style={{
                                                        width:
                                                            `${availabilityPercentage}%`
                                                    }}

                                                >
                                                </div>

                                            </div>


                                            {isLowAvailability && (

                                                <small className="limited-text">
                                                    Only {availableBeds}
                                                    {" "}
                                                    bed remaining
                                                </small>

                                            )}

                                        </div>


                                        {/* BOOK BUTTON */}

                                        <button
                                            className="book-room-button"
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
                                                🛏
                                            </span>

                                            {isAvailable
                                                ? "Reserve This Room"
                                                : "Currently Full"
                                            }

                                            {isAvailable && (

                                                <span className="book-arrow">
                                                    →
                                                </span>

                                            )}

                                        </button>

                                    </article>

                                );

                            }
                        )}

                    </div>

                )}

            </main>


            {/* =================================================
                INFORMATION BANNER
            ================================================= */}

            <section className="rooms-info-section">

                <div className="rooms-info-card">

                    <div className="info-card-icon">
                        🔐
                    </div>

                    <div>

                        <strong>
                            Safe & Comfortable Accommodation
                        </strong>

                        <p>
                            Room availability is updated based on
                            current hostel management records.
                            Choose your preferred room and continue
                            to secure your accommodation.
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
                            Student Accommodation Portal
                        </span>

                    </div>

                </div>


                <p>
                    © {new Date().getFullYear()}
                    {" "}
                    RAMS BOYS HOSTEL.
                    All rights reserved.
                </p>

            </footer>

        </div>

    );

}

export default Rooms;