// Tự động detect API URL
const API_BASE_URL = "http://localhost:5000/api";

console.log('🌐 API Base URL:', API_BASE_URL);

// Call API chuẩn với error handling tốt hơn
export const apiCall = async (endpoint, method = "GET", data = null) => {
    const token = (typeof window !== 'undefined' && localStorage.getItem('token'))
        ? localStorage.getItem('token')
        : null;

    const headers = {
        "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const options = {
        method,
        mode: "cors",
        credentials: "include",
        headers,
    };

    if (data) options.body = JSON.stringify(data);

    try {
        const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
        console.log(`📡 ${method} ${url}`);

        const response = await fetch(url, options);
        const contentType = response.headers.get("Content-Type") || "";

        let parsed;
        if (contentType.includes("application/json")) {
            parsed = await response.json();
        } else {
            parsed = await response.text();
            try { parsed = JSON.parse(parsed); } catch {}
        }

        console.log(`📥 Status: ${response.status}`, parsed);

        // ✅ Tự động clear token cũ khi gặp lỗi 403 (Forbidden)
        if (response.status === 403 || response.status === 401) {
            console.warn('⚠️ Token không hợp lệ, đang xóa...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Chỉ redirect nếu không phải trang login
            if (!window.location.pathname.includes('login')) {
                alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                setTimeout(() => {
                    window.location.href = '/Web/user/pages/login.html';
                }, 1000);
            }
        }

        if (!response.ok) {
            const err = new Error(parsed?.message || `HTTP ${response.status}`);
            err.status = response.status;
            err.payload = parsed;
            throw err;
        }

        return parsed;

    } catch (err) {
        console.error("❌ API Error:", err);
        if (err.message.includes('Failed to fetch')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra server đang chạy tại http://localhost:5000');
        }
        throw err;
    }
};

// ========== USER API ==========
export const userAPI = {
    register: (payload) => apiCall("/users/register", "POST", payload),
    login: (payload) => apiCall("/users/login", "POST", payload),
    activateAdmin: (payload) => apiCall("/users/activate-admin", "POST", payload),
    getAll: () => apiCall("/users"), // ✅ Cần token
    getById: (id) => apiCall(`/users/${id}`), // ✅ Cần token
    update: (id, data) => apiCall(`/users/${id}`, "PUT", data),
    delete: (id) => apiCall(`/users/${id}`, "DELETE"),
    
    // 📍 Address management
    getAddresses: () => apiCall("/users/addresses/list"),
    addAddress: (data) => apiCall("/users/addresses/add", "POST", data),
    updateAddress: (addressId, data) => apiCall(`/users/addresses/${addressId}`, "PUT", data),
    deleteAddress: (addressId) => apiCall(`/users/addresses/${addressId}`, "DELETE"),
    setDefaultAddress: (addressId) => apiCall(`/users/addresses/${addressId}/default`, "PATCH"),
};

// ========== ORDER API ==========
export const orderAPI = {
    getAll: () => apiCall("/orders"), // ✅ Cần token
    getById: (id) => apiCall(`/orders/${id}`),
    getMyOrders: () => apiCall("/orders/my-orders"), // ✅ Cần token
    getTopSellers: (period) => apiCall(`/orders/top/${period}`),
    create: (data) => apiCall("/orders", "POST", data),
    update: (id, data) => apiCall(`/orders/${id}`, "PUT", data),
    updateStatus: (id, status) => apiCall(`/orders/${id}/status`, "PUT", { status }),
    delete: (id) => apiCall(`/orders/${id}`, "DELETE"),
};

// =============================
//        DRUG API
// =============================
export const drugAPI = {
    getAll: () => apiCall("/drugs"),
    getById: (id) => apiCall(`/drugs/${id}`),
    create: (data) => apiCall("/drugs", "POST", data),
    update: (id, data) => apiCall(`/drugs/${id}`, "PUT", data),
    delete: (id) => apiCall(`/drugs/${id}`, "DELETE"),
    search: (q) => apiCall(`/drugs/search?q=${encodeURIComponent(q)}`),
    getByCategory: (categoryId) => apiCall(`/drugs/category/${categoryId}`),
    getLowStock: (threshold = 10) => apiCall(`/drugs/low-stock?threshold=${threshold}`),
};

// =============================
//        CATEGORY API
// =============================
export const categoryAPI = {
    getAll: () => apiCall("/categories"),
    getById: (id) => apiCall(`/categories/${id}`),
    create: (data) => apiCall("/categories", "POST", data),
    update: (id, data) => apiCall(`/categories/${id}`, "PUT", data),
    delete: (id) => apiCall(`/categories/${id}`, "DELETE"),
};

// =============================
//        INVOICE API
// =============================
export const invoiceAPI = {
    getAll: () => apiCall("/invoices"),
    getById: (id) => apiCall(`/invoices/${id}`),
    create: (data) => apiCall("/invoices", "POST", data),
    update: (id, data) => apiCall(`/invoices/${id}`, "PUT", data),
    delete: (id) => apiCall(`/invoices/${id}`, "DELETE"),
    cancel: (id) => apiCall(`/invoices/${id}/cancel`, "PUT"),
};

// =============================
//        DISCOUNT API
// =============================
export const discountAPI = {
    getAll: () => apiCall("/discounts"),
    getById: (id) => apiCall(`/discounts/${id}`),
    validateCode: (code) => apiCall(`/discounts/validate/${code}`),
    create: (data) => apiCall("/discounts", "POST", data),
    update: (id, data) => apiCall(`/discounts/${id}`, "PUT", data),
    delete: (id) => apiCall(`/discounts/${id}`, "DELETE"),
};

// =============================
//        COUPON API
// =============================
export const couponAPI = {
    redeem: (payload) => apiCall("/coupons/redeem", "POST", payload),
};

// =============================
//        UPLOAD API
// =============================
export const uploadAPI = {
    drugImage: async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const token = localStorage.getItem("token");
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/upload/drug-image`, {
            method: "POST",
            headers,
            body: formData,
        });

        return response.json();
    },
    deleteDrugImage: async (filename) => {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/upload/drug-image/${filename}`, {
            method: "DELETE",
            headers,
        });

        return response.json();
    },
};
