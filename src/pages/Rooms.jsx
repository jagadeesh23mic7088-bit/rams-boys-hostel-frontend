import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getBranches,
    getRoomTypes,
    getRooms
} from "../services/api";

function Rooms() {

    const [branches, setBranches] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [selectedBranch, setSelectedBranch] = useState("all");
    const [selectedRoomType, setSelectedRoomType] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // ========================================
    // LOAD DATA FROM BACKEND
    // ========================================

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
                    "Branches Response:",
                    branchesResponse
                );

                console.log(
                    "Room Types Response:",
                    roomTypesResponse
                );

                console.log(
                    "Rooms Response:",
                    roomsResponse
                );


                // ========================================
                // BRANCHES
                // ========================================

                if (branchesResponse?.branches) {

                    setBranches(
                        branchesResponse.branches
                    );

                }


                // ========================================
                // ROOM TYPES
                // ========================================

                if (roomTypesResponse?.roomTypes) {

                    setRoomTypes(
                        roomTypesResponse.roomTypes
                    );

                }


                // ========================================
                // ROOMS
                // ========================================

                if (roomsResponse?.rooms) {

                    setRooms(
                        roomsResponse.rooms
                    );

                }

            } catch (error) {

                console.error(
                    "Room Loading Error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load rooms"
                );

            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, []);


    // ========================================
    // FILTER ROOMS
    // ========================================

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


    // ========================================
    // BOOK SELECTED ROOM
    // ========================================

    const handleBookRoom = (room) => {

        console.log(
            "Selected Room for Booking:",
            room
        );


        /*
        We create a complete selected-room object.

        This makes sure the Booking page receives
        the exact room selected by the student.

        Example:

        Room Number: 24
        Branch: Inavolu
        Room Type: 4-Sharing
        Category: Non-AC
        Monthly Rent: ₹6,500
        Available Beds: 2
        Total Beds: 4
        */

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


        // ========================================
        // NAVIGATE TO BOOKING PAGE
        // ========================================

        navigate(
            "/booking",
            {
                state: {
                    room: selectedRoom
                }
            }
        );

    };


    // ========================================
    // LOADING
    // ========================================

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


    // ========================================
    // ERROR
    // ========================================

    if (error) {

        return (

            <div className="rooms-page">

                <div className="rooms-error">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to Load Rooms
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

                </div>

            </div>

        );

    }


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="rooms-page">


            {/* ========================================
                HEADER
            ======================================== */}

            <header className="rooms-header">

                <div className="rooms-header-content">

                    <div className="rooms-header-text">

                        <div className="brand-badge">
                            RAMS BOYS HOSTEL
                        </div>

                        <h1>
                            Find Your Perfect Room
                        </h1>

                        <p>
                            Explore our comfortable hostel rooms
                            and choose the accommodation that
                            suits you best.
                        </p>

                    </div>


                    <button
                        className="dashboard-button"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    >

                        <span>
                            ←
                        </span>

                        Student Dashboard

                    </button>

                </div>

            </header>


            {/* ========================================
                FILTERS
            ======================================== */}

            <section className="rooms-filters">

                <div className="filter-container">


                    {/* BRANCH */}

                    <div className="filter-group">

                        <label>
                            Select Branch
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
                            Room Type
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

                </div>

            </section>


            {/* ========================================
                MAIN CONTENT
            ======================================== */}

            <main className="rooms-container">


                {/* SECTION TITLE */}

                <div className="rooms-section-heading">

                    <div>

                        <span className="section-label">
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


                    <div className="room-count">

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


                {/* ========================================
                    NO ROOMS
                ======================================== */}

                {filteredRooms.length === 0 ? (

                    <div className="empty-rooms">

                        <div className="empty-icon">
                            🏠
                        </div>

                        <h3>
                            No Rooms Available
                        </h3>

                        <p>
                            No rooms match your selected
                            filters at the moment.
                        </p>

                        <button
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

                    </div>

                ) : (


                    /* ========================================
                        ROOM GRID
                    ======================================== */

                    <div className="rooms-grid">

                        {filteredRooms.map(
                            (room) => {


                                const availableBeds =
                                    room.availableBeds || 0;


                                const totalBeds =
                                    room.totalBeds || 0;


                                const availabilityPercentage =
                                    totalBeds > 0
                                        ? (
                                            availableBeds /
                                            totalBeds
                                        ) * 100
                                        : 0;


                                const isAvailable =
                                    availableBeds > 0;


                                return (

                                    <div
                                        className="room-card"
                                        key={room._id}
                                    >


                                        {/* CARD HEADER */}

                                        <div className="room-card-header">

                                            <div className="room-title">

                                                <span className="room-label">
                                                    ROOM NUMBER
                                                </span>

                                                <h3>
                                                    {room.roomNumber}
                                                </h3>

                                            </div>


                                            <span
                                                className={
                                                    isAvailable
                                                        ? "status available"
                                                        : "status full"
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


                                        {/* ROOM TYPE BADGE */}

                                        <div className="room-type-badge">

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


                                        {/* DETAILS */}

                                        <div className="room-details">


                                            <div className="room-detail">

                                                <span>
                                                    BRANCH
                                                </span>

                                                <strong>
                                                    {room.branch?.name ||
                                                        "Not Available"
                                                    }
                                                </strong>

                                            </div>


                                            <div className="room-detail">

                                                <span>
                                                    ROOM TYPE
                                                </span>

                                                <strong>
                                                    {room.roomType?.name ||
                                                        "Not Available"
                                                    }
                                                </strong>

                                            </div>


                                            <div className="room-detail">

                                                <span>
                                                    TOTAL BEDS
                                                </span>

                                                <strong>
                                                    {totalBeds}
                                                </strong>

                                            </div>


                                            <div className="room-detail">

                                                <span>
                                                    AVAILABLE
                                                </span>

                                                <strong className="available-number">
                                                    {availableBeds}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* RENT */}

                                        <div className="rent-section">

                                            <div>

                                                <span>
                                                    MONTHLY RENT
                                                </span>

                                                <h4>
                                                    ₹
                                                    {(
                                                        room.roomType?.monthlyRent ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </h4>

                                            </div>

                                            <span className="rent-period">
                                                per month
                                            </span>

                                        </div>


                                        {/* BED AVAILABILITY */}

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
                                                        availabilityPercentage > 50
                                                            ? "availability-fill high"
                                                            : availabilityPercentage > 0
                                                                ? "availability-fill medium"
                                                                : "availability-fill low"
                                                    }
                                                    style={{
                                                        width:
                                                            `${availabilityPercentage}%`
                                                    }}
                                                >
                                                </div>

                                            </div>

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

                                            {isAvailable
                                                ? "Book This Room"
                                                : "Currently Full"
                                            }

                                            {isAvailable && (
                                                <span>
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


            {/* ========================================
                FOOTER NOTE
            ======================================== */}

            <footer className="rooms-footer">

                <p>
                    Room availability is updated in real time
                    based on hostel management records.
                </p>

            </footer>

        </div>

    );

}

export default Rooms;