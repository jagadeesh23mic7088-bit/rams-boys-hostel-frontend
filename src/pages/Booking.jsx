import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    getBranches,
    getRoomTypes,
    createBooking
} from "../services/api";

function Booking() {

    const navigate = useNavigate();
    const location = useLocation();

    // ========================================
    // GET ROOM SELECTED FROM ROOMS PAGE
    // ========================================

    const selectedRoomFromRoomsPage =
        location.state?.room || null;


    // ========================================
    // STATE
    // ========================================

    const [branches, setBranches] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);

    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedRoomType, setSelectedRoomType] = useState("");

    const [numberOfBeds, setNumberOfBeds] = useState(1);
    const [moveInDate, setMoveInDate] = useState("");
    const [note, setNote] = useState("");

    const [loadingData, setLoadingData] = useState(true);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ========================================
    // LOAD BRANCHES AND ROOM TYPES
    // ========================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoadingData(true);
                setError("");

                const [
                    branchResponse,
                    roomTypeResponse
                ] = await Promise.all([
                    getBranches(),
                    getRoomTypes()
                ]);


                console.log(
                    "Branches:",
                    branchResponse
                );

                console.log(
                    "Room Types:",
                    roomTypeResponse
                );


                // ========================================
                // BRANCH DATA
                // ========================================

                let loadedBranches = [];

                if (
                    Array.isArray(
                        branchResponse?.branches
                    )
                ) {

                    loadedBranches =
                        branchResponse.branches;

                } else if (
                    Array.isArray(
                        branchResponse?.data
                    )
                ) {

                    loadedBranches =
                        branchResponse.data;

                } else if (
                    Array.isArray(
                        branchResponse
                    )
                ) {

                    loadedBranches =
                        branchResponse;

                }


                setBranches(
                    loadedBranches
                );


                // ========================================
                // ROOM TYPE DATA
                // ========================================

                let loadedRoomTypes = [];

                if (
                    Array.isArray(
                        roomTypeResponse?.roomTypes
                    )
                ) {

                    loadedRoomTypes =
                        roomTypeResponse.roomTypes;

                } else if (
                    Array.isArray(
                        roomTypeResponse?.data
                    )
                ) {

                    loadedRoomTypes =
                        roomTypeResponse.data;

                } else if (
                    Array.isArray(
                        roomTypeResponse
                    )
                ) {

                    loadedRoomTypes =
                        roomTypeResponse;

                }


                setRoomTypes(
                    loadedRoomTypes
                );


                // ========================================
                // AUTO SELECT ROOM FROM ROOMS PAGE
                // ========================================

                if (selectedRoomFromRoomsPage) {

                    console.log(
                        "Selected room from Rooms page:",
                        selectedRoomFromRoomsPage
                    );


                    // ------------------------------------
                    // GET BRANCH ID
                    // ------------------------------------

                    const branchId =
                        typeof selectedRoomFromRoomsPage.branch === "object"
                            ? selectedRoomFromRoomsPage.branch?._id
                            : selectedRoomFromRoomsPage.branch;


                    // ------------------------------------
                    // GET ROOM TYPE ID
                    // ------------------------------------

                    const roomTypeId =
                        typeof selectedRoomFromRoomsPage.roomType === "object"
                            ? selectedRoomFromRoomsPage.roomType?._id
                            : selectedRoomFromRoomsPage.roomType;


                    console.log(
                        "Selected Branch ID:",
                        branchId
                    );

                    console.log(
                        "Selected Room Type ID:",
                        roomTypeId
                    );


                    // ------------------------------------
                    // SET SELECTED BRANCH
                    // ------------------------------------

                    if (branchId) {

                        setSelectedBranch(
                            String(branchId)
                        );

                    }


                    // ------------------------------------
                    // SET SELECTED ROOM TYPE
                    // ------------------------------------

                    if (roomTypeId) {

                        setSelectedRoomType(
                            String(roomTypeId)
                        );

                    }

                }


            } catch (error) {

                console.error(
                    "Booking data error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load hostel information."
                );

            } finally {

                setLoadingData(false);

            }

        };


        loadData();

    }, [selectedRoomFromRoomsPage]);


    // ========================================
    // FILTER ROOM TYPES BY BRANCH
    // ========================================

    const filteredRoomTypes =
        roomTypes.filter(
            (roomType) => {

                if (!selectedBranch) {

                    return false;

                }


                const branchId =
                    typeof roomType.branch === "object"
                        ? roomType.branch?._id
                        : roomType.branch;


                return (
                    String(branchId) ===
                    String(selectedBranch)
                );

            }
        );


    // ========================================
    // SELECTED ROOM TYPE DETAILS
    // ========================================

    const selectedRoom =
        roomTypes.find(
            (roomType) =>
                String(roomType._id) ===
                String(selectedRoomType)
        );


    // ========================================
    // SELECTED BRANCH DETAILS
    // ========================================

    const selectedBranchDetails =
        branches.find(
            (branch) =>
                String(branch._id) ===
                String(selectedBranch)
        );


    // ========================================
    // BRANCH CHANGE
    // ========================================

    const handleBranchChange = (e) => {

        setSelectedBranch(
            e.target.value
        );

        setSelectedRoomType("");

        setNumberOfBeds(1);

        setError("");

    };


    // ========================================
    // ROOM TYPE CHANGE
    // ========================================

    const handleRoomTypeChange = (e) => {

        setSelectedRoomType(
            e.target.value
        );

        setNumberOfBeds(1);

        setError("");

    };


    // ========================================
    // SUBMIT BOOKING
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ========================================
        // CHECK LOGIN
        // ========================================

        const token =
            localStorage.getItem("token");


        if (!token) {

            setError(
                "Please login to continue with your room reservation."
            );

            setTimeout(() => {

                navigate("/login");

            }, 1500);

            return;

        }


        // ========================================
        // VALIDATION
        // ========================================

        if (!selectedBranch) {

            setError(
                "Please select a hostel branch."
            );

            return;

        }


        if (!selectedRoomType) {

            setError(
                "Please select a room accommodation."
            );

            return;

        }


        if (!moveInDate) {

            setError(
                "Please select your preferred move-in date."
            );

            return;

        }


        if (
            !numberOfBeds ||
            Number(numberOfBeds) < 1
        ) {

            setError(
                "Please select at least one bed."
            );

            return;

        }


        if (
            selectedRoom &&
            Number(numberOfBeds) >
            Number(selectedRoom.capacity)
        ) {

            setError(
                `This accommodation allows a maximum of ${selectedRoom.capacity} student(s).`
            );

            return;

        }


        try {

            setLoading(true);


            // ========================================
            // CREATE BOOKING
            // ========================================

            const response =
                await createBooking({

                    branch:
                        selectedBranch,

                    roomType:
                        selectedRoomType,

                    numberOfBeds:
                        Number(numberOfBeds),

                    moveInDate:
                        moveInDate,

                    note:
                        note.trim()

                });


            console.log(
                "Booking Created:",
                response
            );


            // ========================================
            // GET BOOKING
            // ========================================

            const booking =
                response?.booking;


            if (!booking) {

                throw new Error(
                    "Booking created, but booking details were not received."
                );

            }


            // ========================================
            // CREATE COMPLETE BOOKING DETAILS
            // FOR PAYMENT PAGE
            // ========================================

            const completeBooking = {

                ...booking,

                // Branch details
                branch:
                    booking.branch ||
                    selectedBranchDetails ||
                    selectedBranch,

                // Room type details
                roomType:
                    booking.roomType ||
                    selectedRoom ||
                    selectedRoomType,

                // Number of beds
                numberOfBeds:
                    booking.numberOfBeds ||
                    Number(numberOfBeds),

                // Move-in date
                moveInDate:
                    booking.moveInDate ||
                    moveInDate,

                // Note
                note:
                    booking.note ||
                    note.trim(),

                // Monthly rent
                monthlyRent:
                    booking.roomType?.monthlyRent ||
                    selectedRoom?.monthlyRent ||
                    0

            };


            console.log(
                "Complete Booking Saved for Payment:",
                completeBooking
            );


            // ========================================
            // SAVE PENDING BOOKING
            // ========================================

            localStorage.setItem(
                "pendingBooking",
                JSON.stringify(
                    completeBooking
                )
            );


            // ========================================
            // SUCCESS MESSAGE
            // ========================================

            setSuccess(
                "Reservation created successfully. Redirecting to secure payment..."
            );


            // ========================================
            // PAYMENT PAGE
            // ========================================

            setTimeout(() => {

                navigate(
                    "/payment",
                    {
                        state: {
                            booking:
                                completeBooking
                        }
                    }
                );

            }, 1000);


        } catch (error) {

            console.error(
                "Booking error:",
                error
            );


            const errorMessage =
                error?.message || "";


            // ========================================
            // TOKEN ERROR
            // ========================================

            if (
                errorMessage.includes(
                    "No token"
                ) ||
                errorMessage.includes(
                    "Not authorized"
                ) ||
                errorMessage.includes(
                    "Unauthorized"
                )
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                localStorage.removeItem(
                    "isLoggedIn"
                );

                setError(
                    "Your login session has expired. Please login again."
                );

                setTimeout(() => {

                    navigate(
                        "/login"
                    );

                }, 1500);

                return;

            }


            setError(
                errorMessage ||
                "Unable to create your reservation. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // BACK HOME
    // ========================================

    const goBackHome = () => {

        navigate("/");

    };


    // ========================================
    // LOADING
    // ========================================

    if (loadingData) {

        return (

            <div className="booking-page">

                <div className="booking-loading-card">

                    <div className="booking-loading-icon">
                        🏠
                    </div>

                    <h2>
                        Preparing Your Reservation
                    </h2>

                    <p>
                        Please wait while we load available rooms...
                    </p>

                    <div className="booking-loader"></div>

                </div>

            </div>

        );

    }


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="booking-page">

            <div className="booking-wrapper">


                {/* ========================================
                    HEADER
                ======================================== */}

                <div className="booking-header">

                    <div className="booking-logo">
                        🏠
                    </div>

                    <div>

                        <p className="booking-brand">
                            RAMS BOYS HOSTEL
                        </p>

                        <h1>
                            Reserve Your Room
                        </h1>

                        <p className="booking-subtitle">
                            Find your ideal accommodation and complete your reservation in a few simple steps.
                        </p>

                    </div>

                </div>


                {/* ========================================
                    ALERTS
                ======================================== */}

                {error && (

                    <div className="booking-alert booking-alert-error">

                        <span>
                            ⚠️
                        </span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {success && (

                    <div className="booking-alert booking-alert-success">

                        <span>
                            ✓
                        </span>

                        <p>
                            {success}
                        </p>

                    </div>

                )}


                {/* ========================================
                    MAIN CONTENT
                ======================================== */}

                <div className="booking-grid">


                    {/* ========================================
                        FORM CARD
                    ======================================== */}

                    <div className="booking-form-card">

                        <div className="card-heading">

                            <span className="card-heading-icon">
                                📋
                            </span>

                            <div>

                                <h2>
                                    Reservation Details
                                </h2>

                                <p>
                                    Tell us about your accommodation requirements.
                                </p>

                            </div>

                        </div>


                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >


                            {/* ========================================
                                BRANCH
                            ======================================== */}

                            <div className="booking-field">

                                <label>
                                    <span>
                                        🏢
                                    </span>

                                    Hostel Branch
                                </label>

                                <select
                                    value={
                                        selectedBranch
                                    }
                                    onChange={
                                        handleBranchChange
                                    }
                                    disabled={
                                        loading
                                    }
                                >

                                    <option value="">
                                        Select your preferred branch
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


                            {/* ========================================
                                ROOM TYPE
                            ======================================== */}

                            <div className="booking-field">

                                <label>
                                    <span>
                                        🛏️
                                    </span>

                                    Room Accommodation
                                </label>

                                <select
                                    value={
                                        selectedRoomType
                                    }
                                    onChange={
                                        handleRoomTypeChange
                                    }
                                    disabled={
                                        !selectedBranch ||
                                        loading
                                    }
                                >

                                    <option value="">

                                        {!selectedBranch
                                            ? "Select a branch first"
                                            : "Select room accommodation"
                                        }

                                    </option>

                                    {filteredRoomTypes.map(
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
                                                {" • ₹"}
                                                {Number(
                                                    roomType.monthlyRent || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                                /month

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* ========================================
                                SELECTED ROOM SUMMARY
                            ======================================== */}

                            {selectedRoom && (

                                <div className="selected-room-card">

                                    <div className="selected-room-top">

                                        <div>

                                            <span className="room-badge">

                                                {selectedRoom.category}

                                            </span>

                                            <h3>

                                                {selectedRoom.name}
                                                {" "}
                                                Sharing

                                            </h3>

                                        </div>

                                        <div className="room-price">

                                            <strong>

                                                ₹
                                                {Number(
                                                    selectedRoom.monthlyRent || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </strong>

                                            <span>
                                                per month
                                            </span>

                                        </div>

                                    </div>


                                    <div className="room-details">

                                        <div>

                                            👥

                                            <span>
                                                Capacity
                                            </span>

                                            <strong>

                                                {selectedRoom.capacity}
                                                {" "}
                                                student(s)

                                            </strong>

                                        </div>


                                        <div>

                                            🛏️

                                            <span>
                                                Availability
                                            </span>

                                            <strong>

                                                {selectedRoom.availableBeds ??
                                                    selectedRoom.totalBeds ??
                                                    "Available"
                                                }

                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* ========================================
                                NUMBER OF BEDS
                            ======================================== */}

                            <div className="booking-field">

                                <label>

                                    <span>
                                        👥
                                    </span>

                                    Number of Beds

                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    max={
                                        selectedRoom
                                            ? selectedRoom.capacity
                                            : 1
                                    }
                                    value={
                                        numberOfBeds
                                    }
                                    onChange={
                                        (e) =>
                                            setNumberOfBeds(
                                                e.target.value
                                            )
                                    }
                                    disabled={
                                        !selectedRoom ||
                                        loading
                                    }
                                />

                                {selectedRoom && (

                                    <small>

                                        Maximum{" "}
                                        {selectedRoom.capacity}
                                        {" "}
                                        bed(s) for this accommodation.

                                    </small>

                                )}

                            </div>


                            {/* ========================================
                                MOVE IN DATE
                            ======================================== */}

                            <div className="booking-field">

                                <label>

                                    <span>
                                        📅
                                    </span>

                                    Preferred Move-in Date

                                </label>

                                <input
                                    type="date"
                                    value={
                                        moveInDate
                                    }
                                    onChange={
                                        (e) =>
                                            setMoveInDate(
                                                e.target.value
                                            )
                                    }
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    disabled={
                                        loading
                                    }
                                />

                            </div>


                            {/* ========================================
                                NOTE
                            ======================================== */}

                            <div className="booking-field">

                                <label>

                                    <span>
                                        📝
                                    </span>

                                    Additional Information

                                </label>

                                <textarea
                                    placeholder="Tell us anything important about your stay..."
                                    value={
                                        note
                                    }
                                    onChange={
                                        (e) =>
                                            setNote(
                                                e.target.value
                                            )
                                    }
                                    rows="4"
                                    disabled={
                                        loading
                                    }
                                />

                            </div>


                            {/* ========================================
                                SUBMIT
                            ======================================== */}

                            <button
                                type="submit"
                                className="booking-submit-btn"
                                disabled={
                                    loading ||
                                    !selectedBranch ||
                                    !selectedRoomType ||
                                    !moveInDate
                                }
                            >

                                {loading ? (

                                    <>

                                        <span className="button-spinner">
                                        </span>

                                        Creating Reservation...

                                    </>

                                ) : (

                                    <>

                                        Continue to ₹1,500 Payment

                                        <span>
                                            →
                                        </span>

                                    </>

                                )}

                            </button>


                            <button
                                type="button"
                                className="booking-home-btn"
                                onClick={
                                    goBackHome
                                }
                                disabled={
                                    loading
                                }
                            >

                                ← Return to Home

                            </button>

                        </form>

                    </div>


                    {/* ========================================
                        PAYMENT INFORMATION CARD
                    ======================================== */}

                    <div className="booking-side">


                        <div className="secure-payment-card">

                            <div className="secure-icon">
                                🔐
                            </div>

                            <h2>
                                Secure Reservation
                            </h2>

                            <p>
                                A mandatory advance payment is required to confirm your room reservation.
                            </p>


                            <div className="advance-amount">

                                <span>
                                    Advance Payment
                                </span>

                                <strong>
                                    ₹1,500
                                </strong>

                            </div>


                            <div className="payment-steps">

                                <div className="payment-step">

                                    <span>
                                        1
                                    </span>

                                    <p>
                                        Select your branch and accommodation
                                    </p>

                                </div>


                                <div className="payment-step">

                                    <span>
                                        2
                                    </span>

                                    <p>
                                        Submit your reservation details
                                    </p>

                                </div>


                                <div className="payment-step">

                                    <span>
                                        3
                                    </span>

                                    <p>
                                        Complete the ₹1,500 advance payment
                                    </p>

                                </div>


                                <div className="payment-step">

                                    <span>
                                        4
                                    </span>

                                    <p>
                                        Receive your payment confirmation
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ========================================
                            HOSTEL INFORMATION
                        ======================================== */}

                        <div className="booking-info-card">

                            <h3>
                                Why Choose RAMS?
                            </h3>


                            <div className="info-item">

                                <span>
                                    📶
                                </span>

                                <div>

                                    <strong>
                                        Free Wi-Fi
                                    </strong>

                                    <p>
                                        Stay connected throughout your accommodation.
                                    </p>

                                </div>

                            </div>


                            <div className="info-item">

                                <span>
                                    🍽️
                                </span>

                                <div>

                                    <strong>
                                        Quality Food
                                    </strong>

                                    <p>
                                        Enjoy nutritious meals every day.
                                    </p>

                                </div>

                            </div>


                            <div className="info-item">

                                <span>
                                    🧹
                                </span>

                                <div>

                                    <strong>
                                        Clean & Comfortable
                                    </strong>

                                    <p>
                                        Regular room and washroom cleaning.
                                    </p>

                                </div>

                            </div>


                            <div className="info-item">

                                <span>
                                    🔒
                                </span>

                                <div>

                                    <strong>
                                        Safe Environment
                                    </strong>

                                    <p>
                                        A comfortable place to focus on your studies.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Booking;