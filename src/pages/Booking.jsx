import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking, getBranches, getRoomTypes } from "../services/api";
import "./Booking.css";

function Booking() {
    const location = useLocation();
    const navigate = useNavigate();

    // =====================================================
    // SELECTED ROOM FROM ROOMS PAGE
    // =====================================================

    const selectedRoom = location.state?.room;

    // =====================================================
    // DATA
    // =====================================================

    const [branches, setBranches] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);

    // =====================================================
    // FORM VALUES
    // =====================================================

    const [selectedBranch, setSelectedBranch] = useState(
        selectedRoom?.branch?._id ||
        selectedRoom?.branch ||
        ""
    );

    const [selectedRoomType, setSelectedRoomType] = useState(
        selectedRoom?.roomType?._id ||
        selectedRoom?.roomType ||
        ""
    );

    const [beds, setBeds] = useState(1);
    const [moveInDate, setMoveInDate] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");

    // =====================================================
    // UI STATE
    // =====================================================

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =====================================================
    // PAYMENT
    // =====================================================

    const ADVANCE_PAYMENT = 1500;

    // =====================================================
    // LOAD BRANCHES + ROOM TYPES
    // =====================================================

    useEffect(() => {
        const loadData = async () => {
            try {
                setPageLoading(true);

                const [
                    branchesResponse,
                    roomTypesResponse
                ] = await Promise.all([
                    getBranches(),
                    getRoomTypes()
                ]);

                console.log(
                    "Booking Branches:",
                    branchesResponse
                );

                console.log(
                    "Booking Room Types:",
                    roomTypesResponse
                );

                // =================================================
                // EXTRACT BRANCHES
                // =================================================

                let branchList = [];

                if (
                    Array.isArray(
                        branchesResponse?.branches
                    )
                ) {
                    branchList =
                        branchesResponse.branches;
                } else if (
                    Array.isArray(
                        branchesResponse?.data
                    )
                ) {
                    branchList =
                        branchesResponse.data;
                } else if (
                    Array.isArray(
                        branchesResponse
                    )
                ) {
                    branchList =
                        branchesResponse;
                }

                // =================================================
                // EXTRACT ROOM TYPES
                // =================================================

                let roomTypeList = [];

                if (
                    Array.isArray(
                        roomTypesResponse?.roomTypes
                    )
                ) {
                    roomTypeList =
                        roomTypesResponse.roomTypes;
                } else if (
                    Array.isArray(
                        roomTypesResponse?.data
                    )
                ) {
                    roomTypeList =
                        roomTypesResponse.data;
                } else if (
                    Array.isArray(
                        roomTypesResponse
                    )
                ) {
                    roomTypeList =
                        roomTypesResponse;
                }

                setBranches(branchList);
                setRoomTypes(roomTypeList);

            } catch (err) {
                console.error(
                    "Booking data loading error:",
                    err
                );

                setError(
                    "Unable to load hostel accommodation information."
                );

            } finally {
                setPageLoading(false);
            }
        };

        loadData();
    }, []);

    // =====================================================
    // FILTER ROOM TYPES BY SELECTED BRANCH
    // =====================================================

    const filteredRoomTypes = useMemo(() => {
        if (!selectedBranch) {
            return [];
        }

        return roomTypes.filter((roomType) => {

            const roomBranchId =
                typeof roomType.branch === "object"
                    ? roomType.branch?._id
                    : roomType.branch;

            return (
                String(roomBranchId) ===
                String(selectedBranch)
            );
        });

    }, [
        roomTypes,
        selectedBranch
    ]);

    // =====================================================
    // WHEN BRANCH CHANGES
    // SELECT VALID ROOM TYPE
    // =====================================================

    useEffect(() => {

        if (!selectedBranch) {
            setSelectedRoomType("");
            return;
        }

        const selectedRoomTypeStillValid =
            filteredRoomTypes.some(
                (roomType) =>
                    String(roomType._id) ===
                    String(selectedRoomType)
            );

        if (!selectedRoomTypeStillValid) {

            if (
                filteredRoomTypes.length > 0
            ) {

                setSelectedRoomType(
                    filteredRoomTypes[0]._id
                );

            } else {

                setSelectedRoomType("");

            }
        }

    }, [
        selectedBranch,
        filteredRoomTypes,
        selectedRoomType
    ]);

    // =====================================================
    // SELECTED ROOM TYPE DETAILS
    // =====================================================

    const selectedRoomTypeData =
        roomTypes.find(
            (roomType) =>
                String(roomType._id) ===
                String(selectedRoomType)
        );

    // =====================================================
    // BRANCH NAME
    // =====================================================

    const branchName =
        branches.find(
            (branch) =>
                String(branch._id) ===
                String(selectedBranch)
        )?.name ||
        selectedRoom?.branch?.name ||
        "Not Selected";

    // =====================================================
    // ROOM TYPE NAME
    // =====================================================

    const roomTypeName =
        selectedRoomTypeData?.name ||
        selectedRoom?.roomType?.name ||
        "Room";

    // =====================================================
    // ROOM CATEGORY
    // =====================================================

    const roomCategory =
        selectedRoomTypeData?.category ||
        selectedRoom?.roomType?.category ||
        "Standard";

    // =====================================================
    // MONTHLY RENT
    // =====================================================

    const monthlyRent =
        selectedRoomTypeData?.monthlyRent ||
        selectedRoom?.roomType?.monthlyRent ||
        0;

    // =====================================================
    // TOTAL BEDS
    // =====================================================

    const totalBeds =
        selectedRoom?.totalBeds ||
        selectedRoomTypeData?.capacity ||
        selectedRoom?.roomType?.capacity ||
        0;

    // =====================================================
    // AVAILABLE BEDS
    // =====================================================

    const availableBeds =
        selectedRoom?.availableBeds ??
        totalBeds;

    // =====================================================
    // MAXIMUM BOOKABLE BEDS
    // =====================================================

    const maxBeds = Math.max(
        1,
        Math.min(
            availableBeds,
            totalBeds || availableBeds
        )
    );

    // =====================================================
    // HANDLE BRANCH CHANGE
    // =====================================================

    const handleBranchChange = (e) => {

        const newBranchId =
            e.target.value;

        setSelectedBranch(
            newBranchId
        );

        setBeds(1);

        setError("");

        setMessage("");
    };

    // =====================================================
    // HANDLE ROOM TYPE CHANGE
    // =====================================================

    const handleRoomTypeChange = (e) => {

        setSelectedRoomType(
            e.target.value
        );

        setBeds(1);

        setError("");

        setMessage("");
    };

    // =====================================================
    // SUBMIT BOOKING
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        // =================================================
        // VALIDATE BRANCH
        // =================================================

        if (!selectedBranch) {

            setError(
                "Please select a hostel branch."
            );

            return;
        }

        // =================================================
        // VALIDATE ROOM TYPE
        // =================================================

        if (!selectedRoomType) {

            setError(
                "Please select a room accommodation."
            );

            return;
        }

        // =================================================
        // VALIDATE ROOM
        // =================================================

        if (!selectedRoom?._id) {

            setError(
                "Room information is missing. Please return to the rooms page and select a room again."
            );

            return;
        }

        // =================================================
        // VALIDATE DATE
        // =================================================

        if (!moveInDate) {

            setError(
                "Please select your preferred move-in date."
            );

            return;
        }

        // =================================================
        // VALIDATE BEDS
        // =================================================

        if (
            beds < 1 ||
            beds > maxBeds
        ) {

            setError(
                `Please select between 1 and ${maxBeds} bed(s).`
            );

            return;
        }

        try {

            setLoading(true);

            // =================================================
            // BOOKING DATA
            // =================================================

            const bookingData = {

                room:
                    selectedRoom._id,

                branch:
                    selectedBranch,

                roomType:
                    selectedRoomType,

                numberOfBeds:
                    beds,

                moveInDate,

                additionalInfo

            };

            console.log(
                "Creating booking:",
                bookingData
            );

            // =================================================
            // CREATE BOOKING
            // =================================================

            const response =
                await createBooking(
                    bookingData
                );

            console.log(
                "Booking created:",
                response
            );

            // =================================================
            // EXTRACT CREATED BOOKING
            // =================================================

            const createdBooking =
                response?.booking ||
                response;

            const bookingId =
                createdBooking?._id ||
                createdBooking?.id;

            // =================================================
            // COMPLETE BOOKING OBJECT
            // =================================================

            const paymentBooking = {

                ...createdBooking,

                _id:
                    bookingId,

                id:
                    bookingId,

                room:
                    selectedRoom,

                branch:
                    selectedBranch,

                roomType:
                    selectedRoomType,

                numberOfBeds:
                    beds,

                moveInDate,

                additionalInfo,

                monthlyRent,

                advancePayment:
                    ADVANCE_PAYMENT,

                status:
                    createdBooking?.status ||
                    "Pending Payment"

            };

            // =================================================
            // SAVE FOR PAYMENT PAGE
            // =================================================

            localStorage.setItem(
                "pendingBooking",
                JSON.stringify(
                    paymentBooking
                )
            );

            // =================================================
            // SHOW SUCCESS
            // =================================================

            setMessage(
                "Reservation details saved successfully. Redirecting to payment..."
            );

            // =================================================
            // GO TO PAYMENT
            // =================================================

            setTimeout(() => {

                navigate(
                    "/payment",
                    {
                        state: {

                            bookingId,

                            booking:
                                paymentBooking,

                            room:
                                selectedRoom,

                            amount:
                                ADVANCE_PAYMENT

                        }
                    }
                );

            }, 700);

        } catch (err) {

            console.error(
                "Booking creation error:",
                err
            );

            setError(
                err.message ||
                "Unable to create your reservation."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // NO ROOM SELECTED
    // =====================================================

    if (!selectedRoom) {

        return (

            <div className="booking-page">

                <div className="booking-error-page">

                    <div className="booking-error-icon">
                        !
                    </div>

                    <h2>
                        No Room Selected
                    </h2>

                    <p>
                        Please select an available room
                        before continuing with your reservation.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/rooms")
                        }
                    >
                        ← Back to Available Rooms
                    </button>

                </div>

            </div>

        );

    }

    // =====================================================
    // LOADING
    // =====================================================

    if (pageLoading) {

        return (

            <div className="booking-page">

                <div className="booking-loading">

                    <div className="loading-spinner">
                    </div>

                    <h2>
                        Loading Reservation
                    </h2>

                    <p>
                        Preparing available accommodation options...
                    </p>

                </div>

            </div>

        );

    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="booking-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="booking-header">

                <div className="booking-header-inner">

                    <div className="booking-brand">

                        <div className="booking-brand-logo">
                            RB
                        </div>

                        <div className="booking-brand-text">

                            <strong>
                                RAMS BOYS HOSTEL
                            </strong>

                            <span>
                                STUDENT ACCOMMODATION
                            </span>

                        </div>

                    </div>

                    <button
                        className="back-rooms-button"
                        onClick={() =>
                            navigate("/rooms")
                        }
                    >
                        ← Back to Rooms
                    </button>

                </div>

            </header>


            {/* =================================================
                HERO
            ================================================= */}

            <section className="booking-hero">

                <div className="booking-hero-inner">

                    <div>

                        <span className="booking-eyebrow">
                            RESERVATION
                        </span>

                        <h1>
                            Reserve Your Room
                        </h1>

                        <p>
                            Complete your accommodation details
                            and continue to secure your room at
                            RAMS Boys Hostel.
                        </p>

                    </div>

                    <div className="booking-hero-icon">
                        🏠
                    </div>

                </div>

            </section>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="booking-container">

                <div className="booking-layout">


                    {/* =================================================
                        LEFT CARD
                    ================================================= */}

                    <div className="booking-main-card">

                        <div className="booking-card-heading">

                            <div className="heading-icon">
                                📋
                            </div>

                            <div>

                                <span>
                                    RESERVATION DETAILS
                                </span>

                                <h2>
                                    Tell us about your stay
                                </h2>

                                <p>
                                    Choose your accommodation preferences
                                    before continuing to payment.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            SELECTED ROOM
                        ================================================= */}

                        <div className="selected-room-card">

                            <div className="selected-room-icon">
                                🛏️
                            </div>

                            <div className="selected-room-content">

                                <span>
                                    SELECTED ROOM
                                </span>

                                <h3>
                                    Room{" "}
                                    {selectedRoom.roomNumber}
                                </h3>

                                <p>
                                    {branchName}
                                    {" • "}
                                    {roomTypeName}
                                    {" • "}
                                    {roomCategory}
                                </p>

                            </div>

                            <div className="selected-room-rent">

                                <span>
                                    MONTHLY RENT
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        monthlyRent
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>

                        </div>


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form
                            className="booking-form"
                            onSubmit={
                                handleSubmit
                            }
                        >


                            {/* =================================================
                                BRANCH
                            ================================================= */}

                            <div className="form-group">

                                <label>

                                    <span className="form-icon">
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
                                >

                                    <option value="">
                                        Select Hostel Branch
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


                            {/* =================================================
                                ROOM ACCOMMODATION
                            ================================================= */}

                            <div className="form-group">

                                <label>

                                    <span className="form-icon">
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
                                        filteredRoomTypes.length === 0
                                    }
                                >

                                    <option value="">

                                        {!selectedBranch

                                            ? "Select Hostel Branch First"

                                            : filteredRoomTypes.length === 0

                                                ? "No Accommodation Available"

                                                : "Select Room Accommodation"

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

                                                {
                                                    roomType.name
                                                }

                                                {" • "}

                                                {
                                                    roomType.category
                                                }

                                                {" • ₹"}

                                                {Number(
                                                    roomType.monthlyRent
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                                /month

                                            </option>

                                        )
                                    )}

                                </select>

                                {!selectedBranch && (

                                    <small className="form-help">

                                        Select a hostel branch to
                                        view its available room accommodations.

                                    </small>

                                )}

                                {selectedBranch &&
                                    filteredRoomTypes.length === 0 && (

                                        <small className="form-help error-help">

                                            No room accommodations are
                                            currently available for this branch.

                                        </small>

                                    )}

                            </div>


                            {/* =================================================
                                ROOM SUMMARY
                            ================================================= */}

                            {selectedRoomTypeData && (

                                <div className="room-summary-box">

                                    <div className="summary-top">


                                        <div>

                                            <span>
                                                CATEGORY
                                            </span>

                                            <strong>
                                                {
                                                    roomCategory
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                ROOM TYPE
                                            </span>

                                            <strong>
                                                {
                                                    roomTypeName
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                CAPACITY
                                            </span>

                                            <strong>
                                                {
                                                    totalBeds
                                                }
                                                {" "}
                                                student(s)
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                MONTHLY RENT
                                            </span>

                                            <strong className="rent-highlight">

                                                ₹
                                                {Number(
                                                    monthlyRent
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                BEDS
                            ================================================= */}

                            <div className="form-group">

                                <label>

                                    <span className="form-icon">
                                        👥
                                    </span>

                                    Number of Beds

                                </label>

                                <div className="bed-selector">

                                    <button
                                        type="button"
                                        className="bed-control"
                                        disabled={
                                            beds <= 1
                                        }
                                        onClick={() =>
                                            setBeds(
                                                Math.max(
                                                    1,
                                                    beds - 1
                                                )
                                            )
                                        }
                                    >
                                        −
                                    </button>


                                    <div className="bed-count">

                                        {beds}

                                        <span>

                                            {beds === 1
                                                ? " Bed"
                                                : " Beds"
                                            }

                                        </span>

                                    </div>


                                    <button
                                        type="button"
                                        className="bed-control"
                                        disabled={
                                            beds >= maxBeds
                                        }
                                        onClick={() =>
                                            setBeds(
                                                Math.min(
                                                    maxBeds,
                                                    beds + 1
                                                )
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <small className="form-help">

                                    Maximum{" "}
                                    {maxBeds}
                                    {" "}
                                    bed(s) available
                                    for this accommodation.

                                </small>

                            </div>


                            {/* =================================================
                                MOVE IN
                            ================================================= */}

                            <div className="form-group">

                                <label>

                                    <span className="form-icon">
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
                                />

                            </div>


                            {/* =================================================
                                ADDITIONAL INFO
                            ================================================= */}

                            <div className="form-group">

                                <label>

                                    <span className="form-icon">
                                        📝
                                    </span>

                                    Additional Information

                                </label>

                                <textarea
                                    rows="5"
                                    value={
                                        additionalInfo
                                    }
                                    onChange={
                                        (e) =>
                                            setAdditionalInfo(
                                                e.target.value
                                            )
                                    }
                                    placeholder="Tell us anything important about your stay..."
                                />

                            </div>


                            {/* =================================================
                                ERROR
                            ================================================= */}

                            {error && (

                                <div className="booking-alert error">

                                    ⚠️

                                    <span>
                                        {error}
                                    </span>

                                </div>

                            )}


                            {/* =================================================
                                SUCCESS
                            ================================================= */}

                            {message && (

                                <div className="booking-alert success">

                                    ✓

                                    <span>
                                        {message}
                                    </span>

                                </div>

                            )}


                            {/* =================================================
                                BUTTONS
                            ================================================= */}

                            <div className="booking-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        navigate(
                                            "/rooms"
                                        )
                                    }
                                >
                                    ← Return to Rooms
                                </button>


                                <button
                                    type="submit"
                                    className="payment-button"
                                    disabled={
                                        loading ||
                                        !selectedBranch ||
                                        !selectedRoomType
                                    }
                                >

                                    {loading ? (

                                        <>
                                            <span className="button-spinner">
                                            </span>

                                            Processing...
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

                            </div>

                        </form>

                    </div>


                    {/* =================================================
                        SIDEBAR
                    ================================================= */}

                    <aside className="booking-sidebar">


                        {/* SECURE RESERVATION */}

                        <div className="secure-card">

                            <div className="secure-icon">
                                🔐
                            </div>

                            <span className="sidebar-label">
                                SECURE RESERVATION
                            </span>

                            <h2>
                                Reserve with Confidence
                            </h2>

                            <p>
                                A mandatory advance payment is
                                required to confirm your room reservation.
                            </p>

                            <div className="advance-payment">

                                <span>
                                    Advance Payment
                                </span>

                                <strong>
                                    ₹1,500
                                </strong>

                            </div>

                            <div className="reservation-steps">

                                <div className="reservation-step">

                                    <div className="step-number">
                                        1
                                    </div>

                                    <span>
                                        Select your branch
                                        and accommodation
                                    </span>

                                </div>

                                <div className="reservation-step">

                                    <div className="step-number">
                                        2
                                    </div>

                                    <span>
                                        Submit your reservation
                                        details
                                    </span>

                                </div>

                                <div className="reservation-step">

                                    <div className="step-number">
                                        3
                                    </div>

                                    <span>
                                        Complete the ₹1,500
                                        advance payment
                                    </span>

                                </div>

                                <div className="reservation-step">

                                    <div className="step-number">
                                        4
                                    </div>

                                    <span>
                                        Receive your payment
                                        confirmation
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* WHY RAMS */}

                        <div className="why-rams-card">

                            <span className="sidebar-label">
                                WHY CHOOSE RAMS?
                            </span>

                            <h2>
                                Everything You Need
                            </h2>


                            <div className="benefit-item">

                                <div className="benefit-icon">
                                    📶
                                </div>

                                <div>

                                    <strong>
                                        Free Wi-Fi
                                    </strong>

                                    <p>
                                        Stay connected throughout
                                        your accommodation.
                                    </p>

                                </div>

                            </div>


                            <div className="benefit-item">

                                <div className="benefit-icon">
                                    🍽️
                                </div>

                                <div>

                                    <strong>
                                        Quality Food
                                    </strong>

                                    <p>
                                        Enjoy nutritious meals
                                        every day.
                                    </p>

                                </div>

                            </div>


                            <div className="benefit-item">

                                <div className="benefit-icon">
                                    🧹
                                </div>

                                <div>

                                    <strong>
                                        Clean & Comfortable
                                    </strong>

                                    <p>
                                        Regular room and washroom
                                        cleaning.
                                    </p>

                                </div>

                            </div>


                            <div className="benefit-item">

                                <div className="benefit-icon">
                                    🔒
                                </div>

                                <div>

                                    <strong>
                                        Safe Environment
                                    </strong>

                                    <p>
                                        A comfortable place to
                                        focus on your studies.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </aside>

                </div>

            </main>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="booking-footer">

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

            </footer>

        </div>

    );
}

export default Booking;