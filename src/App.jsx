import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ======================================================
// AUTHENTICATION
// ======================================================

import Login from "./pages/Login";
import Register from "./pages/Register";

// ======================================================
// ADMIN
// ======================================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminBranches from "./pages/AdminBranches";
import AdminRooms from "./pages/AdminRooms";

// ======================================================
// STUDENT
// ======================================================

import StudentDashboard from "./pages/StudentDashboard";
import Rooms from "./pages/Rooms";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";

// ======================================================
// APP
// ======================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================================
            DEFAULT
        ================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* ==================================================
            AUTHENTICATION
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================================
            ADMIN
        ================================================== */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/branches"
          element={<AdminBranches />}
        />

        <Route
          path="/admin/rooms"
          element={<AdminRooms />}
        />

        <Route
          path="/admin/room-types"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />

        <Route
          path="/admin/students"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />

        <Route
          path="/admin/payments"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />


        {/* ==================================================
            STUDENT DASHBOARD
        ================================================== */}

        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />


        {/* ==================================================
            STUDENT ROOMS
        ================================================== */}

        <Route
          path="/rooms"
          element={<Rooms />}
        />


        {/* ==================================================
            STUDENT BOOKING
        ================================================== */}

        <Route
          path="/booking"
          element={<Booking />}
        />


        {/* ==================================================
            STUDENT PAYMENT
        ================================================== */}

        <Route
          path="/payment"
          element={<Payment />}
        />


        {/* ==================================================
            STUDENT BOOKING HISTORY
        ================================================== */}

        <Route
          path="/student/bookings"
          element={
            <Navigate
              to="/student/dashboard"
              replace
            />
          }
        />


        {/* ==================================================
            STUDENT PAYMENTS
        ================================================== */}

        <Route
          path="/student/payments"
          element={
            <Navigate
              to="/student/dashboard"
              replace
            />
          }
        />


        {/* ==================================================
            STUDENT PROFILE
        ================================================== */}

        <Route
          path="/student/profile"
          element={
            <Navigate
              to="/student/dashboard"
              replace
            />
          }
        />


        {/* ==================================================
            UNKNOWN ROUTES
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;