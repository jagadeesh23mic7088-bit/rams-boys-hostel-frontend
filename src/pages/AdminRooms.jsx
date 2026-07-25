import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getBranches,
  getRoomTypes,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../services/api";

import "./AdminRooms.css";

const EMPTY_FORM = {
  branch: "",
  roomType: "",
  roomNumber: "",
  totalBeds: "",
  availableBeds: "",
};

function AdminRooms() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [branches, setBranches] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");

  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        branchResponse,
        roomTypeResponse,
        roomResponse,
      ] = await Promise.all([
        getBranches(),
        getRoomTypes(),
        getRooms(),
      ]);

      console.log(
        "BRANCH RESPONSE:",
        branchResponse
      );

      console.log(
        "ROOM TYPES RESPONSE:",
        roomTypeResponse
      );

      console.log(
        "ROOMS RESPONSE:",
        roomResponse
      );

      // =================================================
      // BRANCHES
      // =================================================

      const branchData =
        branchResponse?.data?.branches ||
        branchResponse?.branches ||
        branchResponse?.data ||
        [];

      // =================================================
      // ROOM TYPES
      // =================================================

      const roomTypeData =
        roomTypeResponse?.data?.roomTypes ||
        roomTypeResponse?.roomTypes ||
        roomTypeResponse?.data ||
        [];

      // =================================================
      // ROOMS
      // =================================================

      const roomData =
        roomResponse?.data?.rooms ||
        roomResponse?.rooms ||
        roomResponse?.data ||
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

    } catch (error) {

      console.error(
        "ERROR LOADING ROOM DATA:",
        error
      );

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load room administration data."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // GET BRANCH ID FROM ROOM TYPE
  // =====================================================

  const getRoomTypeBranchId = (
    roomType
  ) => {

    return (
      roomType?.branch?._id ||
      roomType?.branch?.id ||
      roomType?.branch ||
      roomType?.branchId?._id ||
      roomType?.branchId?.id ||
      roomType?.branchId ||
      ""
    );

  };

  // =====================================================
  // FILTER ROOM TYPES BY SELECTED BRANCH
  // =====================================================

  const filteredRoomTypes = useMemo(() => {

    // If no branch selected,
    // show no room types.

    if (!form.branch) {
      return [];
    }

    return roomTypes.filter(
      (roomType) => {

        const roomTypeBranchId =
          getRoomTypeBranchId(
            roomType
          );

        return (
          String(
            roomTypeBranchId
          ) ===
          String(
            form.branch
          )
        );

      }
    );

  }, [
    roomTypes,
    form.branch,
  ]);

  // =====================================================
  // FILTER ROOM TYPES FOR TABLE FILTER
  // =====================================================

  const filteredRoomTypesForFilter =
    useMemo(() => {

      return roomTypes;

    }, [
      roomTypes,
    ]);

  // =====================================================
  // FILTER ROOMS
  // =====================================================

  const filteredRooms = useMemo(() => {

    return rooms.filter(
      (room) => {

        const roomNumber =
          String(
            room.roomNumber || ""
          ).toLowerCase();

        const branchId =
          room.branch?._id ||
          room.branch ||
          "";

        const branchName =
          room.branch?.name ||
          room.branch?.branchName ||
          "";

        const roomTypeId =
          room.roomType?._id ||
          room.roomType ||
          "";

        const roomTypeName =
          room.roomType?.name ||
          "";

        const searchValue =
          search.toLowerCase();

        const matchesSearch =
          !search ||
          roomNumber.includes(
            searchValue
          ) ||
          branchName
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          roomTypeName
            .toLowerCase()
            .includes(
              searchValue
            );

        const matchesBranch =
          !branchFilter ||
          String(
            branchId
          ) ===
          String(
            branchFilter
          );

        const matchesRoomType =
          !roomTypeFilter ||
          String(
            roomTypeId
          ) ===
          String(
            roomTypeFilter
          );

        return (
          matchesSearch &&
          matchesBranch &&
          matchesRoomType
        );

      }
    );

  }, [
    rooms,
    search,
    branchFilter,
    roomTypeFilter,
  ]);

  // =====================================================
  // ROOM STATISTICS
  // =====================================================

  const statistics = useMemo(() => {

    let totalBeds = 0;
    let availableBeds = 0;
    let maintenanceRooms = 0;

    filteredRooms.forEach(
      (room) => {

        totalBeds += Number(
          room.totalBeds || 0
        );

        availableBeds += Number(
          room.availableBeds || 0
        );

        if (
          room.status ===
          "Maintenance"
        ) {
          maintenanceRooms++;
        }

      }
    );

    return {

      totalRooms:
        filteredRooms.length,

      totalBeds,

      availableBeds,

      occupiedBeds:
        Math.max(
          totalBeds -
          availableBeds,
          0
        ),

      maintenanceRooms,

    };

  }, [
    filteredRooms,
  ]);

  // =====================================================
  // OPEN CREATE MODAL
  // =====================================================

  const openCreateModal = () => {

    setModalMode(
      "create"
    );

    setSelectedRoom(
      null
    );

    setForm({

      ...EMPTY_FORM,

      branch:
        branchFilter ||
        "",

      roomType:
        "",

    });

    setModalOpen(
      true
    );

  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (
    room
  ) => {

    const branchId =
      room.branch?._id ||
      room.branch ||
      "";

    const roomTypeId =
      room.roomType?._id ||
      room.roomType ||
      "";

    setModalMode(
      "edit"
    );

    setSelectedRoom(
      room
    );

    setForm({

      branch:
        branchId,

      roomType:
        roomTypeId,

      roomNumber:
        room.roomNumber ||
        "",

      totalBeds:
        room.totalBeds ??
        "",

      availableBeds:
        room.availableBeds ??
        "",

    });

    setModalOpen(
      true
    );

  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {

    if (saving) {
      return;
    }

    setModalOpen(
      false
    );

    setSelectedRoom(
      null
    );

    setForm(
      EMPTY_FORM
    );

  };

  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    // =================================================
    // WHEN BRANCH CHANGES
    // =================================================

    if (
      name ===
      "branch"
    ) {

      setForm(
        (previous) => ({

          ...previous,

          branch:
            value,

          // Clear previous room type
          // because it belongs to
          // another branch.

          roomType:
            "",

          totalBeds:
            "",

          availableBeds:
            "",

        })
      );

      return;

    }

    // =================================================
    // WHEN ROOM TYPE CHANGES
    // =================================================

    if (
      name ===
      "roomType"
    ) {

      const selectedType =
        roomTypes.find(
          (roomType) =>
            String(
              roomType._id
            ) ===
            String(
              value
            )
        );

      if (
        selectedType
      ) {

        const capacity =
          selectedType.capacity ||
          selectedType.totalBeds ||
          selectedType.beds ||
          "";

        setForm(
          (previous) => ({

            ...previous,

            roomType:
              value,

            totalBeds:
              capacity,

            availableBeds:
              capacity,

          })
        );

      } else {

        setForm(
          (previous) => ({

            ...previous,

            roomType:
              value,

          })
        );

      }

      return;

    }

    // =================================================
    // NORMAL FIELD
    // =================================================

    setForm(
      (previous) => ({

        ...previous,

        [name]:
          value,

      })
    );

  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    if (!form.branch) {

      alert(
        "Please select a branch."
      );

      return;

    }

    if (!form.roomType) {

      alert(
        "Please select a room type."
      );

      return;

    }

    if (
      !form.roomNumber.trim()
    ) {

      alert(
        "Please enter a room number."
      );

      return;

    }

    if (
      !form.totalBeds ||
      Number(
        form.totalBeds
      ) < 1
    ) {

      alert(
        "Total beds must be at least 1."
      );

      return;

    }

    if (
      form.availableBeds === "" ||
      Number(
        form.availableBeds
      ) < 0
    ) {

      alert(
        "Please enter a valid available bed count."
      );

      return;

    }

    if (
      Number(
        form.availableBeds
      ) >
      Number(
        form.totalBeds
      )
    ) {

      alert(
        "Available beds cannot be greater than total beds."
      );

      return;

    }

    try {

      setSaving(
        true
      );

      const payload = {

        branch:
          form.branch,

        roomType:
          form.roomType,

        roomNumber:
          form.roomNumber.trim(),

        totalBeds:
          Number(
            form.totalBeds
          ),

        availableBeds:
          Number(
            form.availableBeds
          ),

      };

      console.log(
        "CREATE / UPDATE ROOM PAYLOAD:",
        payload
      );

      if (
        modalMode ===
        "create"
      ) {

        await createRoom(
          payload
        );

      } else {

        await updateRoom(
          selectedRoom._id,
          payload
        );

      }

      setModalOpen(
        false
      );

      setSelectedRoom(
        null
      );

      setForm(
        EMPTY_FORM
      );

      await loadData();

      alert(

        modalMode ===
        "create"

          ? "Room created successfully."

          : "Room updated successfully."

      );

    } catch (
      error
    ) {

      console.error(
        "ROOM SAVE ERROR:",
        error
      );

      alert(

        error?.response?.data?.message ||

        error?.message ||

        "Unable to save room information."

      );

    } finally {

      setSaving(
        false
      );

    }

  };

  // =====================================================
  // DELETE
  // =====================================================

  const askDelete = (
    room
  ) => {

    setRoomToDelete(
      room
    );

    setDeleteModalOpen(
      true
    );

  };

  const closeDeleteModal = () => {

    setDeleteModalOpen(
      false
    );

    setRoomToDelete(
      null
    );

  };

  const confirmDelete = async () => {

    if (
      !roomToDelete
    ) {
      return;
    }

    try {

      await deleteRoom(
        roomToDelete._id
      );

      closeDeleteModal();

      await loadData();

      alert(
        "Room removed successfully."
      );

    } catch (
      error
    ) {

      console.error(
        "DELETE ROOM ERROR:",
        error
      );

      alert(

        error?.response?.data?.message ||

        error?.message ||

        "Unable to delete room."

      );

    }

  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {

    setSearch("");

    setBranchFilter("");

    setRoomTypeFilter("");

  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status
  ) => {

    switch (
      status
    ) {

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
  // RENDER
  // =====================================================

  return (

    <div className="admin-rooms-page">

      {/* ================================================= */}
      {/* TOP BAR */}
      {/* ================================================= */}

      <header className="admin-topbar">

        <div className="brand-area">

          <div className="brand-mark">
            RB
          </div>

          <div>

            <h1>
              RAMS BOYS HOSTEL
            </h1>

            <span>
              Administration Portal
            </span>

          </div>

        </div>

        <div className="topbar-actions">

          <button
            className="topbar-link"
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
          >
            Dashboard
          </button>

          <button
            className="topbar-link"
            onClick={() =>
              navigate("/")
            }
          >
            View Website
          </button>

          <button
            className="logout-button"
            onClick={
              handleLogout
            }
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="admin-content">

        <div className="page-heading">

          <div>

            <span className="eyebrow">
              ROOM ADMINISTRATION
            </span>

            <h2>
              Accommodation Inventory
            </h2>

            <p>
              Manage rooms, bed capacity and
              availability across all RAMS Boys
              Hostel branches.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={
              openCreateModal
            }
          >
            +
            {" "}
            Add New Room
          </button>

        </div>


        {/* ================================================= */}
        {/* STATISTICS */}
        {/* ================================================= */}

        <section className="statistics-grid">

          <div className="stat-card">

            <div className="stat-icon blue">
              ▦
            </div>

            <div>

              <span>
                Total Rooms
              </span>

              <strong>
                {
                  loading
                    ? "—"
                    : statistics.totalRooms
                }
              </strong>

              <small>
                Active accommodation units
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon purple">
              ▪
            </div>

            <div>

              <span>
                Total Beds
              </span>

              <strong>
                {
                  loading
                    ? "—"
                    : statistics.totalBeds
                }
              </strong>

              <small>
                Across selected inventory
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>

              <span>
                Available Beds
              </span>

              <strong>
                {
                  loading
                    ? "—"
                    : statistics.availableBeds
                }
              </strong>

              <small>
                Ready for allocation
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon orange">
              ◉
            </div>

            <div>

              <span>
                Occupied Beds
              </span>

              <strong>
                {
                  loading
                    ? "—"
                    : statistics.occupiedBeds
                }
              </strong>

              <small>
                Currently occupied
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon red">
              !
            </div>

            <div>

              <span>
                Maintenance
              </span>

              <strong>
                {
                  loading
                    ? "—"
                    : statistics.maintenanceRooms
                }
              </strong>

              <small>
                Rooms under maintenance
              </small>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* INVENTORY */}
        {/* ================================================= */}

        <section className="inventory-panel">

          <div className="panel-heading">

            <div>

              <span className="eyebrow">
                INVENTORY CONTROL
              </span>

              <h3>
                Room Inventory
              </h3>

              <p>
                Search and filter accommodation
                inventory by branch and room type.
              </p>

            </div>

            <button
              className="secondary-button"
              onClick={
                openCreateModal
              }
            >
              +
              {" "}
              Add Room
            </button>

          </div>


          {/* ================================================= */}
          {/* FILTERS */}
          {/* ================================================= */}

          <div className="filter-bar">

            <div className="search-field">

              <label>
                Search
              </label>

              <div className="input-wrapper">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search room number..."
                  value={
                    search
                  }
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>


            <div className="filter-field">

              <label>
                Branch
              </label>

              <select
                value={
                  branchFilter
                }
                onChange={(e) =>
                  setBranchFilter(
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
                        branch.name ||
                        branch.branchName ||
                        "Unnamed Branch"
                      }

                    </option>

                  )
                )}

              </select>

            </div>


            <div className="filter-field">

              <label>
                Room Type
              </label>

              <select
                value={
                  roomTypeFilter
                }
                onChange={(e) =>
                  setRoomTypeFilter(
                    e.target.value
                  )
                }
              >

                <option value="">
                  All Room Types
                </option>

                {filteredRoomTypesForFilter.map(
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
                        roomType.name ||
                        "Unnamed Room Type"
                      }

                    </option>

                  )
                )}

              </select>

            </div>


            <button
              className="clear-button"
              onClick={
                clearFilters
              }
            >
              Clear Filters
            </button>

          </div>


          {/* ================================================= */}
          {/* TABLE */}
          {/* ================================================= */}

          <div className="table-container">

            {loading ? (

              <div className="empty-state">

                <div className="loading-spinner"></div>

                <h4>
                  Loading room inventory
                </h4>

                <p>
                  Please wait while accommodation
                  data is being retrieved.
                </p>

              </div>

            ) : filteredRooms.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  ▦
                </div>

                <h4>
                  No rooms found
                </h4>

                <p>
                  No accommodation units match
                  your current search criteria.
                </p>

                <button
                  className="primary-button"
                  onClick={
                    openCreateModal
                  }
                >
                  + Add New Room
                </button>

              </div>

            ) : (

              <table className="rooms-table">

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
                      CATEGORY
                    </th>

                    <th>
                      BEDS
                    </th>

                    <th>
                      AVAILABILITY
                    </th>

                    <th>
                      MONTHLY RENT
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      ACTIONS
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredRooms.map(
                    (room) => {

                      const totalBeds =
                        Number(
                          room.totalBeds ||
                          0
                        );

                      const availableBeds =
                        Number(
                          room.availableBeds ||
                          0
                        );

                      const occupied =
                        Math.max(
                          totalBeds -
                          availableBeds,
                          0
                        );

                      return (

                        <tr
                          key={
                            room._id
                          }
                        >

                          <td>

                            <strong className="room-number">
                              #
                              {
                                room.roomNumber
                              }
                            </strong>

                          </td>


                          <td>

                            <div className="branch-name">

                              <span className="location-icon">
                                ◈
                              </span>

                              {
                                room.branch?.name ||
                                room.branch?.branchName ||
                                "—"
                              }

                            </div>

                          </td>


                          <td>

                            <strong>
                              {
                                room.roomType?.name ||
                                "—"
                              }
                            </strong>

                          </td>


                          <td>

                            <span className="category-text">

                              {
                                room.roomType?.category ||
                                room.roomType?.acType ||
                                "—"
                              }

                            </span>

                          </td>


                          <td>

                            <strong>
                              {
                                totalBeds
                              }
                            </strong>

                            <span className="table-subtext">
                              beds
                            </span>

                          </td>


                          <td>

                            <strong>

                              {
                                availableBeds
                              }

                              {" / "}

                              {
                                totalBeds
                              }

                            </strong>

                            <span className="table-subtext">

                              {
                                occupied
                              }

                              {" occupied"}

                            </span>

                          </td>


                          <td>

                            <strong className="rent-value">

                              ₹
                              {
                                Number(
                                  room.roomType?.monthlyRent ||
                                  0
                                ).toLocaleString(
                                  "en-IN"
                                )
                              }

                            </strong>

                            <span className="table-subtext">
                              / month
                            </span>

                          </td>


                          <td>

                            <span
                              className={`status-badge ${getStatusClass(
                                room.status
                              )}`}
                            >

                              <span className="status-dot"></span>

                              {
                                room.status ||
                                (
                                  availableBeds ===
                                  totalBeds

                                    ? "Available"

                                    : availableBeds ===
                                      0

                                    ? "Fully Occupied"

                                    : "Partially Occupied"
                                )
                              }

                            </span>

                          </td>


                          <td>

                            <div className="action-buttons">

                              <button
                                className="icon-button edit"
                                onClick={() =>
                                  openEditModal(
                                    room
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="icon-button delete"
                                onClick={() =>
                                  askDelete(
                                    room
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            )}

          </div>

        </section>

      </main>


      {/* ================================================= */}
      {/* ADD / EDIT ROOM MODAL */}
      {/* ================================================= */}

      {modalOpen && (

        <div className="modal-overlay">

          <div className="room-modal">

            <div className="modal-header">

              <div>

                <span className="eyebrow">
                  ROOM MANAGEMENT
                </span>

                <h3>

                  {
                    modalMode ===
                    "create"

                      ? "Add New Room"

                      : "Edit Room"
                  }

                </h3>

                <p>

                  {
                    modalMode ===
                    "create"

                      ? "Select the branch first. Only room types available at that branch will be shown."

                      : "Update room information and bed availability."
                  }

                </p>

              </div>

              <button
                className="close-button"
                onClick={
                  closeModal
                }
              >
                ×
              </button>

            </div>


            <form
              className="room-form"
              onSubmit={
                handleSubmit
              }
            >

              {/* ================================================= */}
              {/* LOCATION */}
              {/* ================================================= */}

              <div className="form-section">

                <div className="form-section-title">
                  LOCATION & ROOM TYPE
                </div>

                <div className="form-grid">

                  {/* BRANCH */}

                  <div className="form-group">

                    <label>
                      Branch
                      <span>
                        *
                      </span>
                    </label>

                    <select
                      name="branch"
                      value={
                        form.branch
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="">
                        Select branch
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
                              branch.name ||
                              branch.branchName ||
                              "Unnamed Branch"
                            }

                          </option>

                        )
                      )}

                    </select>

                  </div>


                  {/* ROOM TYPE */}

                  <div className="form-group">

                    <label>
                      Room Type
                      <span>
                        *
                      </span>
                    </label>

                    <select
                      name="roomType"
                      value={
                        form.roomType
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !form.branch
                      }
                    >

                      <option value="">

                        {
                          !form.branch

                            ? "Select branch first"

                            : filteredRoomTypes.length === 0

                            ? "No room types available"

                            : "Select room type"
                        }

                      </option>

                      {filteredRoomTypes.map(
                        (roomType) => {

                          const capacity =
                            roomType.capacity ||
                            roomType.totalBeds ||
                            roomType.beds ||
                            "—";

                          const acType =
                            roomType.acType ||
                            roomType.category ||
                            "";

                          return (

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

                              {" | "}

                              {
                                acType
                              }

                              {" | "}

                              {
                                capacity
                              }

                              {" Beds | ₹"}

                              {
                                Number(
                                  roomType.monthlyRent ||
                                  0
                                ).toLocaleString(
                                  "en-IN"
                                )
                              }

                              {" / month"}

                            </option>

                          );

                        }
                      )}

                    </select>

                  </div>

                </div>


                {/* ================================================= */}
                {/* SELECTED ROOM TYPE DETAILS */}
                {/* ================================================= */}

                {form.roomType && (

                  <div className="selected-room-type-info">

                    {(() => {

                      const selectedType =
                        roomTypes.find(
                          (type) =>
                            String(
                              type._id
                            ) ===
                            String(
                              form.roomType
                            )
                        );

                      if (
                        !selectedType
                      ) {
                        return null;
                      }

                      const capacity =
                        selectedType.capacity ||
                        selectedType.totalBeds ||
                        selectedType.beds ||
                        "—";

                      const acType =
                        selectedType.acType ||
                        selectedType.category ||
                        "—";

                      return (

                        <>

                          <div>

                            <span>
                              ROOM TYPE
                            </span>

                            <strong>
                              {
                                selectedType.name
                              }
                            </strong>

                          </div>

                          <div>

                            <span>
                              CATEGORY
                            </span>

                            <strong>
                              {
                                acType
                              }
                            </strong>

                          </div>

                          <div>

                            <span>
                              CAPACITY
                            </span>

                            <strong>
                              {
                                capacity
                              }{" "}
                              Beds
                            </strong>

                          </div>

                          <div>

                            <span>
                              MONTHLY RENT
                            </span>

                            <strong>
                              ₹
                              {
                                Number(
                                  selectedType.monthlyRent ||
                                  0
                                ).toLocaleString(
                                  "en-IN"
                                )
                              }
                            </strong>

                          </div>

                        </>

                      );

                    })()}

                  </div>

                )}

              </div>


              {/* ================================================= */}
              {/* ROOM CAPACITY */}
              {/* ================================================= */}

              <div className="form-section">

                <div className="form-section-title">
                  ROOM CAPACITY
                </div>

                <div className="form-grid three-columns">

                  <div className="form-group">

                    <label>
                      Room Number
                      <span>
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="roomNumber"
                      value={
                        form.roomNumber
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Example: 101"
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Total Beds
                      <span>
                        *
                      </span>
                    </label>

                    <input
                      type="number"
                      name="totalBeds"
                      min="1"
                      value={
                        form.totalBeds
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Example: 4"
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Available Beds
                      <span>
                        *
                      </span>
                    </label>

                    <input
                      type="number"
                      name="availableBeds"
                      min="0"
                      max={
                        form.totalBeds ||
                        undefined
                      }
                      value={
                        form.availableBeds
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Example: 4"
                    />

                  </div>

                </div>


                <div className="form-info">

                  <span>
                    i
                  </span>

                  <p>
                    The room capacity is automatically
                    suggested from the selected room type.
                    You can adjust the available beds based
                    on current occupancy.
                  </p>

                </div>

              </div>


              {/* ================================================= */}
              {/* FOOTER */}
              {/* ================================================= */}

              <div className="modal-footer">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    saving
                  }
                >

                  {
                    saving

                      ? "Saving..."

                      : modalMode ===
                        "create"

                      ? "Create Room"

                      : "Save Changes"
                  }

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ================================================= */}
      {/* DELETE MODAL */}
      {/* ================================================= */}

      {deleteModalOpen &&
        roomToDelete && (

          <div className="modal-overlay">

            <div className="delete-modal">

              <div className="delete-icon">
                !
              </div>

              <h3>
                Remove Room?
              </h3>

              <p>

                Are you sure you want to remove
                room{" "}

                <strong>
                  #
                  {
                    roomToDelete.roomNumber
                  }
                </strong>

                {" "}
                from the active inventory?

              </p>

              <div className="delete-actions">

                <button
                  className="cancel-button"
                  onClick={
                    closeDeleteModal
                  }
                >
                  Cancel
                </button>

                <button
                  className="danger-button"
                  onClick={
                    confirmDelete
                  }
                >
                  Remove Room
                </button>

              </div>

            </div>

          </div>

        )}

    </div>

  );

}

export default AdminRooms;