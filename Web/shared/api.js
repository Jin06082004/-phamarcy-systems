const API_BASE_URL = "http://localhost:5000";

// Call API chuẩn
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

        if (!response.ok) {
            const err = new Error(parsed?.message || `HTTP ${response.status}`);
            err.status = response.status;
            err.payload = parsed;
            throw err;
        }

        // Return the parsed payload directly so callers receive the actual
        // server response (array or object). Previously we wrapped the
        // parsed value in { success, data } which caused nested data
        // structures and made consumers mis-handle the result.
        return parsed;

    } catch (err) {
        console.error("❌ API Error:", err);
        throw err;
    }
};

// =============================
//        DRUG API
// =============================
export const drugAPI = {
    getAll: () => apiCall("/drugs"),
    getById: (id) => apiCall(`/drugs/${id}`),
    search: (name) => apiCall(`/drugs/search?name=${encodeURIComponent(name)}`),
    create: (data) => apiCall("/drugs/add", "POST", data),
    update: (id, data) => apiCall(`/drugs/${id}`, "PUT", data),
    delete: (id) => apiCall(`/drugs/${id}`, "DELETE"),
    getByCategory: (categoryId) => apiCall(`/drugs/category/${categoryId}`),
};

// =============================
//        CATEGORY API
// =============================
export const categoryAPI = {
    getAll: () => apiCall("/categories"),
    getById: (id) => apiCall(`/categories/${id}`),
    create: (data) => apiCall("/categories/add", "POST", data),
    update: (id, data) => apiCall(`/categories/${id}`, "PUT", data),
    delete: (id) => apiCall(`/categories/${id}`, "DELETE"),
};

// =============================
//        USER API
// =============================
export const userAPI = {
    register: (payload) => apiCall("/users/register", "POST", payload),
    login: (payload) => apiCall("/users/login", "POST", payload),
    activateAdmin: (payload) => apiCall("/users/activate-admin", "POST", payload),
    getAll: () => apiCall("/users"),
    getById: (id) => apiCall(`/users/${id}`),
    update: (id, payload) => apiCall(`/users/${id}`, "PUT", payload),
    delete: (id) => apiCall(`/users/${id}`, "DELETE"),
};

// =============================
//        ORDER API
// =============================
export const orderAPI = {
    getAll: () => apiCall("/orders"),
    getMyOrders: () => apiCall("/orders/my-orders"),
    getById: (id) => apiCall(`/orders/${id}`),
    create: (payload) => apiCall("/orders", "POST", payload),
    update: (id, payload) => apiCall(`/orders/${id}`, "PUT", payload),
    updateStatus: (id, status) => apiCall(`/orders/${id}/status`, "PUT", { status }),
    delete: (id) => apiCall(`/orders/${id}`, "DELETE"),
    getTopSellers: (period) => apiCall(`/orders/top/${period}`),
};

// =============================
//        INVOICE API
// =============================
export const invoiceAPI = {
    getAll: () => apiCall("/invoices"),
    getById: (id) => apiCall(`/invoices/${id}`),
    create: (data) => apiCall("/invoices", "POST", data),
    pay: (id, amount) => apiCall(`/invoices/${id}/pay`, "POST", { amount }),
    delete: (id) => apiCall(`/invoices/${id}`, "DELETE"),
};

// =============================
//        DISCOUNT API
// =============================
export const discountAPI = {
  getAll: () => apiCall("/discounts"),
  getById: (id) => apiCall(`/discounts/${id}`),
  create: (payload) => apiCall("/discounts", "POST", payload),
  update: (id, payload) => apiCall(`/discounts/${id}`, "PUT", payload),
  delete: (id) => apiCall(`/discounts/${id}`, "DELETE"),
};
