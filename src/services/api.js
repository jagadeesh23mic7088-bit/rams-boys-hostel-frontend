// ========================================
// RAMS BOYS HOSTEL
// API SERVICE
// ========================================

// ========================================
// API BASE URL
// ========================================

const API_BASE_URL = "http://localhost:5000/api";


// ========================================
// GET JWT TOKEN
// ========================================

const getToken = () => {

    return localStorage.getItem("token");

};


// ========================================
// COMMON API REQUEST FUNCTION
// ========================================

const apiRequest = async (
    endpoint,
    options = {}
) => {

    // ========================================
    // GET TOKEN
    // ========================================

    const token = getToken();


    // ========================================
    // CREATE HEADERS
    // ========================================

    const headers = {

        "Content-Type":
            "application/json",

        ...(options.headers || {})

    };


    // ========================================
    // ADD JWT TOKEN
    // ========================================

    if (token) {

        headers.Authorization =
            `Bearer ${token}`;

    }


    // ========================================
    // DEBUG TOKEN
    // ========================================

    console.log(
        "API Request:",
        `${API_BASE_URL}${endpoint}`
    );

    console.log(
        "JWT Token Available:",
        token
            ? "YES"
            : "NO"
    );


    try {

        // ========================================
        // SEND REQUEST
        // ========================================

        const response =
            await fetch(

                `${API_BASE_URL}${endpoint}`,

                {

                    ...options,

                    headers

                }

            );


        // ========================================
        // READ RESPONSE
        // ========================================

        const data =
            await response.json();


        // ========================================
        // HANDLE UNAUTHORIZED
        // ========================================

        if (
            response.status === 401
        ) {

            console.error(
                "401 UNAUTHORIZED"
            );

            console.error(
                "Token sent:",
                token
                    ? "YES"
                    : "NO"
            );

            throw new Error(

                data.message ||

                "Not authorized. Please login again."

            );

        }


        // ========================================
        // HANDLE OTHER API ERRORS
        // ========================================

        if (
            !response.ok
        ) {

            throw new Error(

                data.message ||

                "Something went wrong"

            );

        }


        // ========================================
        // RETURN DATA
        // ========================================

        return data;


    } catch (error) {

        console.error(
            "API Error:",
            error
        );

        throw error;

    }

};


// ========================================
// AUTH APIs
// ========================================


// ========================================
// REGISTER STUDENT
// ========================================

export const registerStudent =
    async (
        studentData
    ) => {

        return await apiRequest(

            "/auth/register",

            {

                method:
                    "POST",

                body:
                    JSON.stringify(
                        studentData
                    )

            }

        );

    };


// ========================================
// LOGIN STUDENT / ADMIN
// ========================================

export const loginStudent =
    async (
        loginData
    ) => {

        return await apiRequest(

            "/auth/login",

            {

                method:
                    "POST",

                body:
                    JSON.stringify(
                        loginData
                    )

            }

        );

    };


// ========================================
// STUDENT DASHBOARD
// ========================================

export const getStudentDashboard =
    async () => {

        return await apiRequest(

            "/student/dashboard",

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// STUDENT PROFILE
// ========================================


// ========================================
// GET PROFILE
// ========================================

export const getStudentProfile =
    async () => {

        return await apiRequest(

            "/student/profile",

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// UPDATE PROFILE
// ========================================

export const updateStudentProfile =
    async (
        profileData
    ) => {

        return await apiRequest(

            "/student/profile",

            {

                method:
                    "PUT",

                body:
                    JSON.stringify(
                        profileData
                    )

            }

        );

    };


// ========================================
// CHANGE PASSWORD
// ========================================

export const changeStudentPassword =
    async (
        passwordData
    ) => {

        return await apiRequest(

            "/student/change-password",

            {

                method:
                    "PUT",

                body:
                    JSON.stringify(
                        passwordData
                    )

            }

        );

    };


// ========================================
// STUDENT BOOKINGS
// ========================================


// ========================================
// GET STUDENT BOOKINGS
// ========================================

export const getStudentBookings =
    async () => {

        return await apiRequest(

            "/student/bookings",

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// CREATE BOOKING
// ========================================

export const createBooking =
    async (
        bookingData
    ) => {

        return await apiRequest(

            "/bookings",

            {

                method:
                    "POST",

                body:
                    JSON.stringify(
                        bookingData
                    )

            }

        );

    };


// ========================================
// GET SINGLE STUDENT BOOKING
// ========================================

export const getStudentBookingById =
    async (
        bookingId
    ) => {

        return await apiRequest(

            `/student/bookings/${bookingId}`,

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// CANCEL STUDENT BOOKING
// ========================================

export const cancelStudentBooking =
    async (
        bookingId
    ) => {

        return await apiRequest(

            `/student/bookings/${bookingId}/cancel`,

            {

                method:
                    "PUT"

            }

        );

    };


// ========================================
// STUDENT PAYMENT HISTORY
// ========================================

export const getStudentPayments =
    async () => {

        return await apiRequest(

            "/student/payments",

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// BRANCH APIs
// ========================================


// ========================================
// GET ALL BRANCHES
// ========================================

export const getBranches =
    async () => {

        return await apiRequest(

            "/branches",

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// GET SINGLE BRANCH
// ========================================

export const getBranchById =
    async (
        branchId
    ) => {

        return await apiRequest(

            `/branches/${branchId}`,

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// ROOM TYPE APIs
// ========================================


// ========================================
// GET ALL ROOM TYPES
// ========================================

export const getRoomTypes =
    async () => {

        return await apiRequest(

            "/room-types",

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// GET SINGLE ROOM TYPE
// ========================================

export const getRoomTypeById =
    async (
        roomTypeId
    ) => {

        return await apiRequest(

            `/room-types/${roomTypeId}`,

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// ROOM APIs
// ========================================


// ========================================
// GET ALL ROOMS
// ========================================

export const getRooms =
    async () => {

        return await apiRequest(

            "/rooms",

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// GET SINGLE ROOM
// ========================================

export const getRoomById =
    async (
        roomId
    ) => {

        return await apiRequest(

            `/rooms/${roomId}`,

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// CREATE ROOM
// ADMIN
// ========================================

export const createRoom =
    async (
        roomData
    ) => {

        return await apiRequest(

            "/rooms",

            {

                method:
                    "POST",

                body:
                    JSON.stringify(
                        roomData
                    )

            }

        );

    };


// ========================================
// UPDATE ROOM
// ADMIN
// ========================================

export const updateRoom =
    async (
        roomId,
        roomData
    ) => {

        return await apiRequest(

            `/rooms/${roomId}`,

            {

                method:
                    "PUT",

                body:
                    JSON.stringify(
                        roomData
                    )

            }

        );

    };


// ========================================
// DELETE ROOM
// ADMIN
// ========================================

export const deleteRoom =
    async (
        roomId
    ) => {

        return await apiRequest(

            `/rooms/${roomId}`,

            {

                method:
                    "DELETE"

            }

        );

    };


// ========================================
// ADMIN BOOKING APIs
// ========================================


// ========================================
// GET ALL BOOKINGS
// ========================================

export const getAllBookings =
    async () => {

        return await apiRequest(

            "/bookings",

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// GET SINGLE BOOKING
// ========================================

export const getBookingById =
    async (
        bookingId
    ) => {

        return await apiRequest(

            `/bookings/${bookingId}`,

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// UPDATE BOOKING STATUS
// ========================================

export const updateBookingStatus =
    async (
        bookingId,
        bookingData
    ) => {

        return await apiRequest(

            `/bookings/${bookingId}`,

            {

                method:
                    "PUT",

                body:
                    JSON.stringify(
                        bookingData
                    )

            }

        );

    };


// ========================================
// ADMIN PAYMENT APIs
// ========================================


// ========================================
// GET ALL PAYMENTS
// ========================================

export const getAllPayments =
    async () => {

        return await apiRequest(

            "/payments",

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// GET SINGLE PAYMENT
// ========================================

export const getPaymentById =
    async (
        paymentId
    ) => {

        return await apiRequest(

            `/payments/${paymentId}`,

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// ADMIN USER APIs
// ========================================


// ========================================
// GET ALL USERS
// ========================================

export const getAllUsers =
    async () => {

        return await apiRequest(

            "/users",

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// GET SINGLE USER
// ========================================

export const getUserById =
    async (
        userId
    ) => {

        return await apiRequest(

            `/users/${userId}`,

            {

                method:
                    "GET"

            }

        );

    };


// ========================================
// LOGOUT
// ========================================

export const logout =
    () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "isLoggedIn"
        );

    };


// ========================================
// GET TOKEN
// ========================================

export const getAuthToken =
    () => {

        return localStorage.getItem(
            "token"
        );

    };


// ========================================
// DEFAULT API OBJECT
// ========================================

const api = {

    // AUTH
    registerStudent,
    loginStudent,

    // STUDENT
    getStudentDashboard,
    getStudentProfile,
    updateStudentProfile,
    changeStudentPassword,

    // STUDENT BOOKINGS
    getStudentBookings,
    getStudentBookingById,
    createBooking,
    cancelStudentBooking,

    // STUDENT PAYMENTS
    getStudentPayments,

    // BRANCHES
    getBranches,
    getBranchById,

    // ROOM TYPES
    getRoomTypes,
    getRoomTypeById,

    // ROOMS
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,

    // ADMIN BOOKINGS
    getAllBookings,
    getBookingById,
    updateBookingStatus,

    // ADMIN PAYMENTS
    getAllPayments,
    getPaymentById,

    // ADMIN USERS
    getAllUsers,
    getUserById,

    // AUTH HELPERS
    logout,
    getAuthToken

};


// ========================================
// DEFAULT EXPORT
// ========================================

export default api;