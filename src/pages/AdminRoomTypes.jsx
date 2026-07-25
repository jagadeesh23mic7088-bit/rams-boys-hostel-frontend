import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRoomTypes,
  getBranches,
} from "../services/api";

const AdminRoomTypes = () => {
  const navigate = useNavigate();

  const [roomTypes, setRoomTypes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD DATA
  // ========================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [roomTypesResponse, branchesResponse] =
        await Promise.all([
          getRoomTypes(),
          getBranches(),
        ]);

      // ROOM TYPES
      const roomTypeData =
        roomTypesResponse?.roomTypes ||
        roomTypesResponse?.data?.roomTypes ||
        roomTypesResponse?.data ||
        [];

      // BRANCHES
      const branchData =
        branchesResponse?.branches ||
        branchesResponse?.data?.branches ||
        branchesResponse?.data ||
        [];

      setRoomTypes(
        Array.isArray(roomTypeData)
          ? roomTypeData
          : []
      );

      setBranches(
        Array.isArray(branchData)
          ? branchData
          : []
      );

    } catch (err) {
      console.error(
        "Error loading room types:",
        err
      );

      setError(
        err.message ||
        "Unable to load room types."
      );

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/login");
  };

  // ========================================
  // GET BRANCH NAME
  // ========================================

  const getBranchName = (branchId) => {
    if (!branchId) {
      return "All Branches";
    }

    const branch = branches.find(
      (item) =>
        item._id === branchId ||
        item._id === branchId?._id
    );

    return branch?.name || "—";
  };

  // ========================================
  // CALCULATIONS
  // ========================================

  const totalRoomTypes =
    roomTypes.length;

  const acRoomTypes =
    roomTypes.filter(
      (room) =>
        room.category === "AC" ||
        room.name?.toLowerCase().includes("ac")
    ).length;

  const nonAcRoomTypes =
    totalRoomTypes - acRoomTypes;

  // ========================================
  // PAGE
  // ========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily:
          "Inter, Arial, sans-serif",
        color: "#1f2937",
      }}
    >

      {/* ======================================== */}
      {/* TOP NAVIGATION */}
      {/* ======================================== */}

      <header
        style={{
          background: "#ffffff",
          borderBottom:
            "1px solid #e5e7eb",
          padding:
            "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >

          <button
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
            style={{
              border: "none",
              background:
                "#f3f4f6",
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            ←
          </button>

          <div>

            <div
              style={{
                fontSize: "13px",
                color: "#6b7280",
                fontWeight: "600",
                letterSpacing:
                  "0.08em",
              }}
            >
              RAMS BOYS HOSTEL
            </div>

            <h1
              style={{
                margin: "3px 0 0",
                fontSize: "23px",
                fontWeight: "700",
              }}
            >
              Room Type Management
            </h1>

          </div>

        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >

          <button
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
            style={{
              padding:
                "10px 18px",
              border:
                "1px solid #d1d5db",
              background:
                "#ffffff",
              borderRadius:
                "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding:
                "10px 18px",
              border: "none",
              background:
                "#111827",
              color: "#ffffff",
              borderRadius:
                "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ======================================== */}
      {/* MAIN CONTENT */}
      {/* ======================================== */}

      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding:
            "35px 32px",
        }}
      >

        {/* PAGE HEADER */}

        <section
          style={{
            marginBottom: "30px",
          }}
        >

          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              fontWeight: "700",
              letterSpacing:
                "0.12em",
              marginBottom: "8px",
            }}
          >
            ACCOMMODATION CONFIGURATION
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "750",
            }}
          >
            Room Types
          </h2>

          <p
            style={{
              marginTop: "10px",
              color: "#6b7280",
              fontSize: "15px",
            }}
          >
            View and manage the accommodation
            categories available across RAMS Boys
            Hostel branches.
          </p>

        </section>


        {/* ======================================== */}
        {/* SUMMARY CARDS */}
        {/* ======================================== */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "18px",
            marginBottom: "30px",
          }}
        >

          <div
            style={{
              background:
                "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius:
                "14px",
              padding:
                "24px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.04)",
            }}
          >

            <span
              style={{
                color: "#6b7280",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              TOTAL ROOM TYPES
            </span>

            <strong
              style={{
                display: "block",
                marginTop: "8px",
                fontSize: "30px",
              }}
            >
              {loading
                ? "—"
                : totalRoomTypes}
            </strong>

          </div>


          <div
            style={{
              background:
                "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius:
                "14px",
              padding:
                "24px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.04)",
            }}
          >

            <span
              style={{
                color: "#6b7280",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              AC ROOM TYPES
            </span>

            <strong
              style={{
                display: "block",
                marginTop: "8px",
                fontSize: "30px",
              }}
            >
              {loading
                ? "—"
                : acRoomTypes}
            </strong>

          </div>


          <div
            style={{
              background:
                "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius:
                "14px",
              padding:
                "24px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.04)",
            }}
          >

            <span
              style={{
                color: "#6b7280",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              NON-AC ROOM TYPES
            </span>

            <strong
              style={{
                display: "block",
                marginTop: "8px",
                fontSize: "30px",
              }}
            >
              {loading
                ? "—"
                : nonAcRoomTypes}
            </strong>

          </div>

        </section>


        {/* ======================================== */}
        {/* ERROR */}
        {/* ======================================== */}

        {error && (

          <div
            style={{
              background:
                "#fef2f2",
              border:
                "1px solid #fecaca",
              color:
                "#b91c1c",
              padding:
                "15px 18px",
              borderRadius:
                "10px",
              marginBottom:
                "20px",
            }}
          >
            {error}
          </div>

        )}


        {/* ======================================== */}
        {/* ROOM TYPE INVENTORY */}
        {/* ======================================== */}

        <section
          style={{
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius:
              "16px",
            overflow: "hidden",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.04)",
          }}
        >

          <div
            style={{
              padding:
                "25px 28px",
              borderBottom:
                "1px solid #e5e7eb",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >

            <div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  fontWeight: "700",
                  letterSpacing:
                    "0.1em",
                }}
              >
                ACCOMMODATION INVENTORY
              </div>

              <h3
                style={{
                  margin:
                    "6px 0 0",
                  fontSize: "21px",
                }}
              >
                Configured Room Types
              </h3>

            </div>

          </div>


          {/* ======================================== */}
          {/* TABLE */}
          {/* ======================================== */}

          <div
            style={{
              overflowX: "auto",
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
              }}
            >

              <thead>

                <tr
                  style={{
                    background:
                      "#f9fafb",
                  }}
                >

                  <th
                    style={thStyle}
                  >
                    ROOM TYPE
                  </th>

                  <th
                    style={thStyle}
                  >
                    CATEGORY
                  </th>

                  <th
                    style={thStyle}
                  >
                    CAPACITY
                  </th>

                  <th
                    style={thStyle}
                  >
                    MONTHLY RENT
                  </th>

                  <th
                    style={thStyle}
                  >
                    BRANCH
                  </th>

                  <th
                    style={thStyle}
                  >
                    STATUS
                  </th>

                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        padding:
                          "50px",
                        textAlign:
                          "center",
                        color:
                          "#6b7280",
                      }}
                    >
                      Loading room types...
                    </td>

                  </tr>

                ) : roomTypes.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        padding:
                          "50px",
                        textAlign:
                          "center",
                        color:
                          "#6b7280",
                      }}
                    >
                      No room types found.
                    </td>

                  </tr>

                ) : (

                  roomTypes.map(
                    (roomType) => (

                      <tr
                        key={
                          roomType._id
                        }
                        style={{
                          borderTop:
                            "1px solid #f0f1f3",
                        }}
                      >

                        <td
                          style={tdStyle}
                        >

                          <strong>
                            {roomType.name ||
                              "—"}
                          </strong>

                        </td>

                        <td
                          style={tdStyle}
                        >
                          {roomType.category ||
                            "—"}
                        </td>

                        <td
                          style={tdStyle}
                        >
                          {roomType.capacity ||
                            0}{" "}
                          beds
                        </td>

                        <td
                          style={tdStyle}
                        >

                          <strong>
                            ₹
                            {Number(
                              roomType.monthlyRent ||
                              0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                          <span
                            style={{
                              color:
                                "#6b7280",
                              fontSize:
                                "13px",
                            }}
                          >
                            {" "}
                            / month
                          </span>

                        </td>

                        <td
                          style={tdStyle}
                        >

                          {roomType.branch?.name ||
                            getBranchName(
                              roomType.branch
                            )}

                        </td>

                        <td
                          style={tdStyle}
                        >

                          <span
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              padding:
                                "6px 11px",
                              borderRadius:
                                "20px",
                              background:
                                "#ecfdf5",
                              color:
                                "#047857",
                              fontSize:
                                "12px",
                              fontWeight:
                                "700",
                            }}
                          >
                            Active
                          </span>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
};


// ========================================
// TABLE STYLES
// ========================================

const thStyle = {
  padding:
    "15px 20px",
  textAlign:
    "left",
  fontSize:
    "11px",
  fontWeight:
    "700",
  color:
    "#6b7280",
  letterSpacing:
    "0.08em",
  whiteSpace:
    "nowrap",
};

const tdStyle = {
  padding:
    "18px 20px",
  fontSize:
    "14px",
  color:
    "#374151",
  whiteSpace:
    "nowrap",
};


// ========================================
// EXPORT
// ========================================

export default AdminRoomTypes;