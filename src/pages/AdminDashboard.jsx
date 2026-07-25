import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getBranches,
  getRoomTypes,
  getRooms,
} from "../services/api";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [branches, setBranches] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        branchesRes,
        roomTypesRes,
        roomsRes,
      ] = await Promise.all([
        getBranches(),
        getRoomTypes(),
        getRooms(),
      ]);

      // =================================================
      // BRANCH DATA
      // =================================================

      const branchData =
        branchesRes?.branches ||
        branchesRes?.data?.branches ||
        branchesRes?.data ||
        [];

      // =================================================
      // ROOM TYPE DATA
      // =================================================

      const roomTypeData =
        roomTypesRes?.roomTypes ||
        roomTypesRes?.data?.roomTypes ||
        roomTypesRes?.data ||
        [];

      // =================================================
      // ROOM DATA
      // =================================================

      const roomData =
        roomsRes?.rooms ||
        roomsRes?.data?.rooms ||
        roomsRes?.data ||
        [];

      setBranches(
        Array.isArray(branchData)
          ? branchData
          : []
      );

      setRoomTypes(
        Array.isArray(roomTypeData)
          ? roomTypeData
          : []
      );

      setRooms(
        Array.isArray(roomData)
          ? roomData
          : []
      );

    } catch (err) {

      console.error(
        "Error loading admin dashboard:",
        err
      );

      setError(
        err?.message ||
        "Unable to load dashboard data."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // ROOM STATISTICS
  // =====================================================

  const totalRooms = rooms.length;

  const totalBeds = rooms.reduce(
    (total, room) => {
      return (
        total +
        Number(room?.totalBeds || 0)
      );
    },
    0
  );

  const availableBeds = rooms.reduce(
    (total, room) => {
      return (
        total +
        Number(room?.availableBeds || 0)
      );
    },
    0
  );

  const occupiedBeds =
    Math.max(
      0,
      totalBeds - availableBeds
    );

  const fullyOccupiedRooms =
    rooms.filter(
      (room) =>
        room?.status ===
        "Fully Occupied"
    ).length;

  const maintenanceRooms =
    rooms.filter(
      (room) =>
        room?.status ===
        "Maintenance"
    ).length;

  const availableRooms =
    rooms.filter(
      (room) =>
        room?.status ===
        "Available"
    ).length;

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
      "/login",
      {
        replace: true,
      }
    );
  };

  // =====================================================
  // VIEW WEBSITE
  // =====================================================

  const handleViewWebsite = () => {

    window.open(
      "/",
      "_blank"
    );

  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status
  ) => {

    switch (status) {

      case "Available":
        return "status-available";

      case "Partially Occupied":
        return "status-partial";

      case "Fully Occupied":
        return "status-full";

      case "Maintenance":
        return "status-maintenance";

      default:
        return "";

    }

  };

  // =====================================================
  // LOADING VALUE
  // =====================================================

  const displayValue = (
    value
  ) => {

    return loading
      ? "—"
      : value;

  };

  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="admin-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">

        {/* BRAND */}

        <div className="sidebar-brand">

          <div className="brand-logo">
            RAMS
          </div>

          <div className="brand-text">

            <strong>
              RAMS
            </strong>

            <span>
              BOYS HOSTEL
            </span>

          </div>

        </div>


        {/* ADMIN PROFILE */}

        <div className="admin-profile">

          <div className="profile-avatar">
            A
          </div>

          <div className="profile-details">

            <strong>
              Administrator
            </strong>

            <span>
              Hostel Management
            </span>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="sidebar-navigation">

          {/* MAIN MENU */}

          <div className="nav-section-title">
            MAIN MENU
          </div>

          <button
            type="button"
            className="nav-item active"
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
          >

            <span className="nav-icon">
              ▦
            </span>

            <span>
              Dashboard
            </span>

          </button>


          {/* MANAGEMENT */}

          <div className="nav-section-title">
            MANAGEMENT
          </div>


          {/* BRANCHES */}

          <button
            type="button"
            className="nav-item"
            onClick={() =>
              navigate(
                "/admin/branches"
              )
            }
          >

            <span className="nav-icon">
              ▦
            </span>

            <span>
              Branches
            </span>

          </button>


          {/* ROOM TYPES */}

          <button
            type="button"
            className="nav-item"
            onClick={() =>
              navigate(
                "/admin/room-types"
              )
            }
          >

            <span className="nav-icon">
              ▣
            </span>

            <span>
              Room Types
            </span>

          </button>


          {/* ROOMS */}

          <button
            type="button"
            className="nav-item"
            onClick={() =>
              navigate(
                "/admin/rooms"
              )
            }
          >

            <span className="nav-icon">
              ▤
            </span>

            <span>
              Rooms
            </span>

          </button>


          {/* BOOKINGS */}

          <button
            type="button"
            className="nav-item"
            onClick={() =>
              navigate(
                "/admin/bookings"
              )
            }
          >

            <span className="nav-icon">
              ▤
            </span>

            <span>
              Bookings
            </span>

          </button>


          {/* STUDENTS */}

          <button
            type="button"
            className="nav-item"
            onClick={() =>
              navigate(
                "/admin/students"
              )
            }
          >

            <span className="nav-icon">
              ♙
            </span>

            <span>
              Students
            </span>

          </button>


          {/* PAYMENTS */}

          <button
            type="button"
            className="nav-item"
            onClick={() =>
              navigate(
                "/admin/payments"
              )
            }
          >

            <span className="nav-icon">
              ₹
            </span>

            <span>
              Payments
            </span>

          </button>

        </nav>


        {/* SIDEBAR FOOTER */}

        <div className="sidebar-footer">

          <button
            type="button"
            className="sidebar-footer-button"
            onClick={
              handleViewWebsite
            }
          >

            <span>
              ↗
            </span>

            <span>
              View Website
            </span>

          </button>


          <button
            type="button"
            className="sidebar-footer-button logout"
            onClick={
              handleLogout
            }
          >

            <span>
              ⇥
            </span>

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="admin-main">


        {/* =================================================
            TOP HEADER
        ================================================= */}

        <header className="admin-topbar">

          <div className="topbar-title">

            <h1>
              Dashboard Overview
            </h1>

            <p>
              Welcome to your RAMS Boys Hostel
              administration dashboard.
            </p>

          </div>


          <div className="topbar-actions">

            <button
              type="button"
              className="website-button"
              onClick={
                handleViewWebsite
              }
            >
              ↗ View Website
            </button>


            <button
              type="button"
              className="topbar-logout"
              onClick={
                handleLogout
              }
            >
              Logout
            </button>

          </div>

        </header>


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (

          <div className="admin-error-message">

            <strong>
              Dashboard data could not be loaded.
            </strong>

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={
                loadDashboardData
              }
            >
              Try Again
            </button>

          </div>

        )}


        {/* =================================================
            WELCOME BANNER
        ================================================= */}

        <section className="welcome-banner">

          <div className="welcome-content">

            <span className="welcome-label">
              ADMINISTRATION PORTAL
            </span>

            <h2>
              Welcome back, Administrator
            </h2>

            <p>
              Manage branches, rooms, students,
              bookings and hostel operations
              from one central platform.
            </p>

          </div>


          <div className="welcome-decoration">
            RAMS
          </div>

        </section>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="stats-grid">


          {/* BRANCHES */}

          <div className="stat-card">

            <div className="stat-icon branch-icon">
              ▦
            </div>

            <div className="stat-content">

              <span>
                HOSTEL LOCATIONS
              </span>

              <strong>
                {displayValue(
                  branches.length
                )}
              </strong>

              <p>
                Total Branches
              </p>

            </div>

          </div>


          {/* ROOMS */}

          <div className="stat-card">

            <div className="stat-icon room-icon">
              ▤
            </div>

            <div className="stat-content">

              <span>
                ACCOMMODATION
              </span>

              <strong>
                {displayValue(
                  totalRooms
                )}
              </strong>

              <p>
                Total Rooms
              </p>

            </div>

          </div>


          {/* ROOM TYPES */}

          <div className="stat-card">

            <div className="stat-icon type-icon">
              ▣
            </div>

            <div className="stat-content">

              <span>
                ROOM CATEGORIES
              </span>

              <strong>
                {displayValue(
                  roomTypes.length
                )}
              </strong>

              <p>
                Room Types
              </p>

            </div>

          </div>


          {/* AVAILABLE ROOMS */}

          <div className="stat-card">

            <div className="stat-icon available-icon">
              ✓
            </div>

            <div className="stat-content">

              <span>
                AVAILABILITY
              </span>

              <strong>
                {displayValue(
                  availableRooms
                )}
              </strong>

              <p>
                Available Rooms
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            BED SUMMARY
        ================================================= */}

        <section className="bed-summary">


          {/* TOTAL */}

          <div className="bed-summary-card">

            <span>
              Total Beds
            </span>

            <strong>
              {displayValue(
                totalBeds
              )}
            </strong>

          </div>


          {/* AVAILABLE */}

          <div className="bed-summary-card">

            <span>
              Available Beds
            </span>

            <strong className="green-number">

              {displayValue(
                availableBeds
              )}

            </strong>

          </div>


          {/* OCCUPIED */}

          <div className="bed-summary-card">

            <span>
              Occupied Beds
            </span>

            <strong className="orange-number">

              {displayValue(
                occupiedBeds
              )}

            </strong>

          </div>


          {/* FULLY OCCUPIED */}

          <div className="bed-summary-card">

            <span>
              Fully Occupied Rooms
            </span>

            <strong className="red-number">

              {displayValue(
                fullyOccupiedRooms
              )}

            </strong>

          </div>


          {/* MAINTENANCE */}

          <div className="bed-summary-card">

            <span>
              Maintenance
            </span>

            <strong className="gray-number">

              {displayValue(
                maintenanceRooms
              )}

            </strong>

          </div>

        </section>


        {/* =================================================
            HOSTEL OPERATIONS
        ================================================= */}

        <section className="management-section">

          <div className="section-heading">

            <div>

              <span>
                MANAGEMENT
              </span>

              <h2>
                Hostel Operations
              </h2>

              <p>
                Access and manage all major
                hostel operations from here.
              </p>

            </div>

          </div>


          <div className="management-grid">


            {/* BRANCH MANAGEMENT */}

            <button
              type="button"
              className="management-card"
              onClick={() =>
                navigate(
                  "/admin/branches"
                )
              }
            >

              <div className="management-icon">
                ▦
              </div>

              <div>

                <h3>
                  Branch Management
                </h3>

                <p>
                  Add, edit and manage RAMS
                  Boys Hostel branches and
                  locations.
                </p>

                <span>
                  Manage Branches →
                </span>

              </div>

            </button>


            {/* ROOM TYPE MANAGEMENT */}

            <button
              type="button"
              className="management-card"
              onClick={() =>
                navigate(
                  "/admin/room-types"
                )
              }
            >

              <div className="management-icon">
                ▣
              </div>

              <div>

                <h3>
                  Room Type Management
                </h3>

                <p>
                  Manage room categories,
                  capacity, AC type and
                  monthly rental prices.
                </p>

                <span>
                  Manage Room Types →
                </span>

              </div>

            </button>


            {/* ROOM MANAGEMENT */}

            <button
              type="button"
              className="management-card"
              onClick={() =>
                navigate(
                  "/admin/rooms"
                )
              }
            >

              <div className="management-icon">
                ▤
              </div>

              <div>

                <h3>
                  Room Management
                </h3>

                <p>
                  Add rooms, update bed
                  availability and manage
                  accommodation inventory.
                </p>

                <span>
                  Manage Rooms →
                </span>

              </div>

            </button>


            {/* BOOKING MANAGEMENT */}

            <button
              type="button"
              className="management-card"
              onClick={() =>
                navigate(
                  "/admin/bookings"
                )
              }
            >

              <div className="management-icon">
                ▤
              </div>

              <div>

                <h3>
                  Booking Management
                </h3>

                <p>
                  Review student bookings,
                  approve reservations and
                  manage booking status.
                </p>

                <span>
                  Manage Bookings →
                </span>

              </div>

            </button>


            {/* STUDENT MANAGEMENT */}

            <button
              type="button"
              className="management-card"
              onClick={() =>
                navigate(
                  "/admin/students"
                )
              }
            >

              <div className="management-icon">
                ♙
              </div>

              <div>

                <h3>
                  Student Management
                </h3>

                <p>
                  View registered students
                  and manage hostel accounts.
                </p>

                <span>
                  Manage Students →
                </span>

              </div>

            </button>


            {/* PAYMENT MANAGEMENT */}

            <button
              type="button"
              className="management-card"
              onClick={() =>
                navigate(
                  "/admin/payments"
                )
              }
            >

              <div className="management-icon">
                ₹
              </div>

              <div>

                <h3>
                  Payment Management
                </h3>

                <p>
                  Monitor student payments,
                  payment history and
                  transaction records.
                </p>

                <span>
                  Manage Payments →
                </span>

              </div>

            </button>

          </div>

        </section>


        {/* =================================================
            ROOM INVENTORY
        ================================================= */}

        <section className="inventory-section">


          <div className="section-heading inventory-heading">

            <div>

              <span>
                ACCOMMODATION INVENTORY
              </span>

              <h2>
                Room Overview
              </h2>

              <p>
                Monitor current room and bed
                availability across all hostel
                branches.
              </p>

            </div>


            <button
              type="button"
              className="view-all-button"
              onClick={() =>
                navigate(
                  "/admin/rooms"
                )
              }
            >
              View All Rooms →
            </button>

          </div>


          <div className="inventory-table-wrapper">

            <table className="inventory-table">

              <thead>

                <tr>

                  <th>
                    ROOM
                  </th>

                  <th>
                    BRANCH
                  </th>

                  <th>
                    ROOM TYPE
                  </th>

                  <th>
                    BEDS
                  </th>

                  <th>
                    AVAILABLE
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>


              <tbody>

                {/* LOADING */}

                {loading && (

                  <tr>

                    <td
                      colSpan="7"
                      className="loading-row"
                    >
                      Loading accommodation
                      inventory...
                    </td>

                  </tr>

                )}


                {/* EMPTY */}

                {!loading &&
                  rooms.length === 0 && (

                    <tr>

                      <td
                        colSpan="7"
                        className="empty-row"
                      >
                        No rooms available.
                      </td>

                    </tr>

                  )}


                {/* ROOM DATA */}

                {!loading &&
                  rooms.length > 0 &&
                  rooms
                    .slice(0, 5)
                    .map(
                      (room) => (

                        <tr
                          key={
                            room._id
                          }
                        >


                          {/* ROOM NUMBER */}

                          <td>

                            <div className="room-number">

                              <span className="room-symbol">
                                ▤
                              </span>

                              <strong>
                                {
                                  room.roomNumber ||
                                  "—"
                                }
                              </strong>

                            </div>

                          </td>


                          {/* BRANCH */}

                          <td>

                            {
                              room.branch?.name ||
                              "—"
                            }

                          </td>


                          {/* ROOM TYPE */}

                          <td>

                            {
                              room.roomType?.name ||
                              "—"
                            }

                          </td>


                          {/* BEDS */}

                          <td>

                            {
                              room.totalBeds ||
                              0
                            }

                          </td>


                          {/* AVAILABLE */}

                          <td>

                            <strong>

                              {
                                room.availableBeds ||
                                0
                              }

                            </strong>

                            <span className="bed-total">

                              {" / "}

                              {
                                room.totalBeds ||
                                0
                              }

                            </span>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={
                                `status-badge ${
                                  getStatusClass(
                                    room.status
                                  )
                                }`
                              }
                            >

                              <span className="status-dot">
                                ●
                              </span>

                              {
                                room.status ||
                                "Unknown"
                              }

                            </span>

                          </td>


                          {/* ACTION */}

                          <td>

                            <button
                              type="button"
                              className="table-view-button"
                              onClick={() =>
                                navigate(
                                  "/admin/rooms"
                                )
                              }
                            >
                              View
                            </button>

                          </td>

                        </tr>

                      )
                    )}

              </tbody>

            </table>

          </div>

        </section>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="quick-actions-section">

          <div className="section-heading">

            <span>
              QUICK ACTIONS
            </span>

            <h2>
              Common Tasks
            </h2>

          </div>


          <div className="quick-actions">


            {/* ADD ROOM */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/rooms"
                )
              }
            >

              <span>
                +
              </span>

              Add New Room

            </button>


            {/* ADD BRANCH */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/branches"
                )
              }
            >

              <span>
                +
              </span>

              Add Branch

            </button>


            {/* ADD ROOM TYPE */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/room-types"
                )
              }
            >

              <span>
                +
              </span>

              Add Room Type

            </button>


            {/* REVIEW BOOKINGS */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/bookings"
                )
              }
            >

              <span>
                →
              </span>

              Review Bookings

            </button>

          </div>

        </section>

      </main>

    </div>

  );

};

export default AdminDashboard;