import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBranches } from "../services/api";
import "./AdminBranches.css";

function AdminBranches() {
    const navigate = useNavigate();

    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadBranches();
    }, []);

    const loadBranches = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getBranches();

            console.log("Branches API Response:", response);

            // Your backend may return:
            // { branches: [...] }
            // or directly [...]
            if (Array.isArray(response)) {
                setBranches(response);
            } else if (Array.isArray(response.branches)) {
                setBranches(response.branches);
            } else {
                setBranches([]);
            }

        } catch (err) {
            console.error("Error loading branches:", err);
            setError(
                err.message ||
                "Unable to load branches. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleViewBranch = (branchId) => {
        navigate(`/admin/branches/${branchId}`);
    };

    return (
        <div className="admin-branches-page">

            {/* ================================= */}
            {/* TOP HEADER */}
            {/* ================================= */}

            <header className="branches-header">

                <div className="header-left">

                    <button
                        className="back-button"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        ←
                    </button>

                    <div>
                        <div className="header-eyebrow">
                            RAMS BOYS HOSTEL
                        </div>

                        <h1>
                            Branch Management
                        </h1>

                        <p>
                            Manage hostel locations and branch information
                        </p>
                    </div>

                </div>

                <div className="header-actions">

                    <button
                        className="website-button"
                        onClick={() => navigate("/")}
                    >
                        View Website
                    </button>

                    <button
                        className="dashboard-button"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        Dashboard
                    </button>

                </div>

            </header>


            {/* ================================= */}
            {/* MAIN CONTENT */}
            {/* ================================= */}

            <main className="branches-content">

                {/* ================================= */}
                {/* PAGE TITLE */}
                {/* ================================= */}

                <section className="page-introduction">

                    <div>

                        <span className="section-label">
                            ADMINISTRATION
                        </span>

                        <h2>
                            Hostel Branches
                        </h2>

                        <p>
                            View and manage all RAMS Boys Hostel
                            locations from one central place.
                        </p>

                    </div>

                    <div className="branch-count-card">

                        <span className="count-label">
                            TOTAL BRANCHES
                        </span>

                        <strong>
                            {branches.length}
                        </strong>

                        <span>
                            Active hostel locations
                        </span>

                    </div>

                </section>


                {/* ================================= */}
                {/* LOADING */}
                {/* ================================= */}

                {loading && (

                    <div className="state-card">

                        <div className="loading-spinner"></div>

                        <h3>
                            Loading Branches
                        </h3>

                        <p>
                            Please wait while we load hostel
                            branch information.
                        </p>

                    </div>

                )}


                {/* ================================= */}
                {/* ERROR */}
                {/* ================================= */}

                {!loading && error && (

                    <div className="state-card error-state">

                        <div className="state-icon">
                            !
                        </div>

                        <h3>
                            Unable to Load Branches
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            className="retry-button"
                            onClick={loadBranches}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* ================================= */}
                {/* NO BRANCHES */}
                {/* ================================= */}

                {!loading &&
                    !error &&
                    branches.length === 0 && (

                        <div className="state-card">

                            <div className="state-icon">
                                🏢
                            </div>

                            <h3>
                                No Branches Found
                            </h3>

                            <p>
                                There are currently no hostel
                                branches available.
                            </p>

                        </div>

                    )}


                {/* ================================= */}
                {/* BRANCH CARDS */}
                {/* ================================= */}

                {!loading &&
                    !error &&
                    branches.length > 0 && (

                        <section className="branches-section">

                            <div className="section-heading">

                                <div>

                                    <span className="section-label">
                                        HOSTEL LOCATIONS
                                    </span>

                                    <h2>
                                        All Branches
                                    </h2>

                                </div>

                                <span className="results-count">
                                    {branches.length} locations
                                </span>

                            </div>


                            <div className="branches-grid">

                                {branches.map((branch) => (

                                    <article
                                        className="branch-card"
                                        key={branch._id}
                                    >

                                        {/* CARD HEADER */}

                                        <div className="branch-card-header">

                                            <div className="branch-icon">
                                                🏢
                                            </div>

                                            <span className="active-badge">
                                                Active
                                            </span>

                                        </div>


                                        {/* BRANCH INFORMATION */}

                                        <div className="branch-card-body">

                                            <h3>
                                                {branch.name}
                                            </h3>

                                            <div className="branch-location">

                                                <span>
                                                    📍
                                                </span>

                                                <span>
                                                    {branch.address ||
                                                        "Address information unavailable"}
                                                </span>

                                            </div>

                                            {branch.distanceFromUniversity && (

                                                <div className="branch-distance">

                                                    <span>
                                                        🎓
                                                    </span>

                                                    <span>
                                                        {branch.distanceFromUniversity}
                                                        {" "}from VIT-AP University
                                                    </span>

                                                </div>

                                            )}

                                            {branch.facilities &&
                                                branch.facilities.length > 0 && (

                                                    <div className="facilities-preview">

                                                        <span className="facility-title">
                                                            Facilities
                                                        </span>

                                                        <div className="facility-list">

                                                            {branch.facilities
                                                                .slice(0, 4)
                                                                .map(
                                                                    (
                                                                        facility,
                                                                        index
                                                                    ) => (

                                                                        <span
                                                                            key={index}
                                                                            className="facility-tag"
                                                                        >
                                                                            ✓{" "}
                                                                            {facility}
                                                                        </span>

                                                                    )
                                                                )}

                                                        </div>

                                                        {branch.facilities.length > 4 && (

                                                            <span className="more-facilities">
                                                                +{" "}
                                                                {branch.facilities.length - 4}
                                                                {" "}more
                                                            </span>

                                                        )}

                                                    </div>

                                                )}

                                        </div>


                                        {/* CARD FOOTER */}

                                        <div className="branch-card-footer">

                                            <button
                                                className="view-branch-button"
                                                onClick={() =>
                                                    handleViewBranch(
                                                        branch._id
                                                    )
                                                }
                                            >
                                                View Branch Details
                                                <span>
                                                    →
                                                </span>
                                            </button>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        </section>

                    )}

            </main>

        </div>
    );
}

export default AdminBranches;