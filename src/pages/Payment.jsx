import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import paymentQR from "../assets/images/payment-qr.jpeg";
import "./Payment.css";

import {
    getBranches,
    getRoomTypes
} from "../services/api";


function Payment() {

    const location = useLocation();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);

    const [branches, setBranches] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [paymentClicked, setPaymentClicked] =
        useState(false);

    const [upiOpened, setUpiOpened] =
        useState(false);


    // =====================================================
    // PAYMENT DETAILS
    // =====================================================

    const PAYMENT_AMOUNT = 1500;

    const UPI_ID =
        "devanshduggineni@okicici";

    const HOSTEL_NAME =
        "RAMS BOYS HOSTEL";


    // =====================================================
    // LOAD PAYMENT DATA
    // =====================================================

    useEffect(() => {

        const loadPaymentData = async () => {

            try {

                setLoading(true);
                setError("");


                // =================================================
                // FIRST: GET BOOKING FROM REACT ROUTER STATE
                // =================================================

                let savedBooking =
                    location.state?.booking;


                // =================================================
                // SECOND: GET BOOKING FROM LOCAL STORAGE
                // =================================================

                if (!savedBooking) {

                    const localBooking =
                        localStorage.getItem(
                            "pendingBooking"
                        );

                    if (localBooking) {

                        savedBooking =
                            JSON.parse(
                                localBooking
                            );

                    }

                }


                // =================================================
                // CHECK BOOKING
                // =================================================

                if (!savedBooking) {

                    setError(
                        "We could not find your booking information. Please return to the booking page and try again."
                    );

                    setLoading(false);

                    return;

                }


                console.log(
                    "Payment Booking:",
                    savedBooking
                );


                // =================================================
                // SAVE BOOKING TO STATE
                // =================================================

                setBooking(
                    savedBooking
                );


                // =================================================
                // LOAD BRANCHES + ROOM TYPES
                // =================================================

                const [
                    branchResponse,
                    roomTypeResponse
                ] = await Promise.all([

                    getBranches(),

                    getRoomTypes()

                ]);


                // =================================================
                // BRANCH LIST
                // =================================================

                let branchList = [];

                if (
                    Array.isArray(
                        branchResponse?.branches
                    )
                ) {

                    branchList =
                        branchResponse.branches;

                } else if (
                    Array.isArray(
                        branchResponse?.data
                    )
                ) {

                    branchList =
                        branchResponse.data;

                } else if (
                    Array.isArray(
                        branchResponse
                    )
                ) {

                    branchList =
                        branchResponse;

                }


                // =================================================
                // ROOM TYPE LIST
                // =================================================

                let roomTypeList = [];

                if (
                    Array.isArray(
                        roomTypeResponse?.roomTypes
                    )
                ) {

                    roomTypeList =
                        roomTypeResponse.roomTypes;

                } else if (
                    Array.isArray(
                        roomTypeResponse?.data
                    )
                ) {

                    roomTypeList =
                        roomTypeResponse.data;

                } else if (
                    Array.isArray(
                        roomTypeResponse
                    )
                ) {

                    roomTypeList =
                        roomTypeResponse;

                }


                setBranches(
                    branchList
                );

                setRoomTypes(
                    roomTypeList
                );


            } catch (err) {

                console.error(
                    "Payment page error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load your booking information."
                );

            } finally {

                setLoading(false);

            }

        };


        loadPaymentData();

    }, [
        location.state
    ]);


    // =====================================================
    // BACK TO BOOKING
    // =====================================================

    const goBackToBooking = () => {

        navigate(
            "/booking",
            {
                state: {
                    room:
                        booking?.room
                }
            }
        );

    };


    // =====================================================
    // OPEN UPI
    // =====================================================

    const handleUPIPayment = () => {

        const upiLink =
            `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
            `&pn=${encodeURIComponent(HOSTEL_NAME)}` +
            `&am=${PAYMENT_AMOUNT}` +
            `&cu=INR` +
            `&tn=${encodeURIComponent(
                "RAMS Boys Hostel Booking Advance"
            )}`;


        console.log(
            "UPI Payment Link:",
            upiLink
        );


        setUpiOpened(
            true
        );


        window.location.href =
            upiLink;

    };


    // =====================================================
    // PAYMENT COMPLETED
    // =====================================================

    const handlePayment = () => {

        setPaymentClicked(
            true
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="payment-page">

                <div className="payment-container">

                    <div className="payment-loading-icon">
                        💳
                    </div>

                    <h1>
                        RAMS BOYS HOSTEL
                    </h1>

                    <p>
                        Loading payment information...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !booking) {

        return (

            <div className="payment-page">

                <div className="payment-container payment-error-container">

                    <div className="payment-error-icon">
                        ⚠️
                    </div>

                    <h1>
                        Payment Information Missing
                    </h1>

                    <p>
                        {error ||
                            "We could not find your booking information."
                        }
                    </p>

                    <button
                        type="button"
                        className="payment-back-button"
                        onClick={
                            goBackToBooking
                        }
                    >
                        ← Go Back to Booking
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // BRANCH ID
    // =====================================================

    const bookingBranchId =

        typeof booking.branch === "object"

            ? booking.branch?._id

            : booking.branch;


    // =====================================================
    // SELECTED BRANCH
    // =====================================================

    const selectedBranch =

        branches.find(
            (branch) =>
                String(branch._id) ===
                String(bookingBranchId)
        );


    // =====================================================
    // ROOM TYPE ID
    // =====================================================

    const bookingRoomTypeId =

        typeof booking.roomType === "object"

            ? booking.roomType?._id

            : booking.roomType;


    // =====================================================
    // SELECTED ROOM TYPE
    // =====================================================

    const selectedRoomType =

        roomTypes.find(
            (roomType) =>
                String(roomType._id) ===
                String(bookingRoomTypeId)
        );


    // =====================================================
    // ROOM
    // =====================================================

    const selectedRoom =

        typeof booking.room === "object"

            ? booking.room

            : null;


    // =====================================================
    // DETAILS
    // =====================================================

    const branchName =

        selectedBranch?.name ||

        booking.branch?.name ||

        "Selected Branch";


    const roomName =

        selectedRoomType?.name ||

        booking.roomType?.name ||

        "Selected Room";


    const roomCategory =

        selectedRoomType?.category ||

        booking.roomType?.category ||

        "";


    const monthlyRent =

        selectedRoomType?.monthlyRent ||

        booking.roomType?.monthlyRent ||

        booking.monthlyRent ||

        0;


    const roomNumber =

        selectedRoom?.roomNumber ||

        "Selected Room";


    // =====================================================
    // PAYMENT PAGE
    // =====================================================

    return (

        <div className="payment-page">

            <div className="payment-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="payment-header">

                    <div className="payment-logo">
                        RB
                    </div>

                    <h1>
                        RAMS BOYS HOSTEL
                    </h1>

                    <h2>
                        Complete Your Booking
                    </h2>

                    <p>
                        Pay the mandatory advance payment
                        to confirm your room reservation.
                    </p>

                </div>


                {/* =================================================
                    BOOKING SUMMARY
                ================================================= */}

                <div className="booking-summary">

                    <div className="summary-title">

                        <span>
                            📋
                        </span>

                        <h3>
                            Booking Summary
                        </h3>

                    </div>


                    <div className="summary-grid">


                        <div className="summary-item">

                            <span>
                                Room Number
                            </span>

                            <strong>
                                {roomNumber}
                            </strong>

                        </div>


                        <div className="summary-item">

                            <span>
                                Hostel Branch
                            </span>

                            <strong>
                                {branchName}
                            </strong>

                        </div>


                        <div className="summary-item">

                            <span>
                                Room Type
                            </span>

                            <strong>

                                {roomName}

                                {roomCategory &&
                                    ` • ${roomCategory}`
                                }

                            </strong>

                        </div>


                        <div className="summary-item">

                            <span>
                                Number of Beds
                            </span>

                            <strong>
                                {
                                    booking.numberOfBeds ||
                                    1
                                }
                            </strong>

                        </div>


                        <div className="summary-item">

                            <span>
                                Monthly Rent
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


                        <div className="summary-item">

                            <span>
                                Move-in Date
                            </span>

                            <strong>

                                {booking.moveInDate

                                    ? new Date(
                                        booking.moveInDate
                                    ).toLocaleDateString(
                                        "en-IN"
                                    )

                                    : "Not specified"

                                }

                            </strong>

                        </div>


                        <div className="summary-item">

                            <span>
                                Booking Status
                            </span>

                            <strong className="pending-status">

                                {booking.status ||
                                    "Pending Payment"
                                }

                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    PAYMENT CARD
                ================================================= */}

                <div className="payment-card">


                    <div className="payment-card-header">

                        <span className="payment-icon">
                            💳
                        </span>

                        <div>

                            <h2>
                                Advance Payment
                            </h2>

                            <p>
                                Mandatory booking confirmation payment
                            </p>

                        </div>

                    </div>


                    {/* AMOUNT */}

                    <div className="payment-amount">

                        <span>
                            Amount Payable
                        </span>

                        <strong>
                            ₹1,500
                        </strong>

                    </div>


                    {/* UPI */}

                    <div className="upi-app-payment-section">

                        <h3>
                            Pay Directly Using UPI
                        </h3>

                        <p>
                            Tap below to open your
                            available UPI payment application.
                        </p>


                        <button
                            type="button"
                            className="upi-pay-button"
                            onClick={
                                handleUPIPayment
                            }
                        >

                            📱 Pay ₹1,500 with UPI App

                        </button>


                        {upiOpened && (

                            <div className="upi-open-message">

                                <strong>
                                    UPI payment request initiated.
                                </strong>

                                <p>
                                    If the UPI application did not open,
                                    please use the QR code below.
                                </p>

                            </div>

                        )}

                    </div>


                    {/* QR */}

                    <div className="qr-section">

                        <div className="qr-payment-box">

                            <h3>
                                Scan & Pay
                            </h3>

                            <p>
                                Scan the QR code using any UPI application.
                            </p>


                            <div className="qr-image-container">

                                <img
                                    src={paymentQR}
                                    alt="RAMS BOYS HOSTEL UPI Payment QR Code"
                                    className="payment-qr-image"
                                />

                            </div>


                            <div className="upi-details">

                                <p>

                                    <strong>
                                        UPI ID:
                                    </strong>

                                    {" "}

                                    {UPI_ID}

                                </p>


                                <p>

                                    <strong>
                                        Amount:
                                    </strong>

                                    {" ₹1,500"}

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* INSTRUCTIONS */}

                    <div className="payment-instructions">

                        <h3>
                            How to Complete Payment
                        </h3>


                        <div className="instruction">

                            <span>
                                1
                            </span>

                            <p>
                                Open your preferred UPI application.
                            </p>

                        </div>


                        <div className="instruction">

                            <span>
                                2
                            </span>

                            <p>
                                Pay exactly
                                <strong>
                                    {" ₹1,500 "}
                                </strong>
                                as the booking advance.
                            </p>

                        </div>


                        <div className="instruction">

                            <span>
                                3
                            </span>

                            <p>
                                Save your UPI transaction ID.
                            </p>

                        </div>


                        <div className="instruction">

                            <span>
                                4
                            </span>

                            <p>
                                Click "I Have Paid" after completing payment.
                            </p>

                        </div>

                    </div>


                    {/* CONFIRMATION */}

                    {paymentClicked && (

                        <div className="payment-coming-soon">

                            <span>
                                ℹ️
                            </span>

                            <p>
                                Your payment details will be verified
                                by RAMS BOYS HOSTEL. Please keep your
                                UPI transaction ID for verification.
                            </p>

                        </div>

                    )}


                    {/* PAID */}

                    <button
                        type="button"
                        className="pay-button"
                        onClick={
                            handlePayment
                        }
                    >

                        ✓ I Have Paid ₹1,500

                    </button>


                    {/* BACK */}

                    <button
                        type="button"
                        className="payment-back-button"
                        onClick={
                            goBackToBooking
                        }
                    >

                        ← Back to Booking

                    </button>

                </div>


                {/* SECURITY */}

                <div className="payment-security">

                    🔒

                    <span>
                        Your booking information is securely
                        processed by RAMS BOYS HOSTEL.
                    </span>

                </div>

            </div>

        </div>

    );

}


export default Payment;