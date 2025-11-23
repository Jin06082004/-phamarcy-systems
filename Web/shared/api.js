const API_BASE_URL = "http://localhost:5000"; // Thay đổi nếu cần

export const apiCall = async (endpoint, method = "GET", data = null) => {
    const options = {
        method,
        mode: 'cors',
        credentials: 'include', // include cookies (if used). change to 'omit' if not needed
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
        console.log(`📡 ${method} ${url}`);
        
        const response = await fetch(url, options);
        
        const responseText = await response.text();
        console.log(`📥 Status: ${response.status}`, responseText);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${responseText}`);
        }

        const result = JSON.parse(responseText);
        console.log(`✅ API Response:`, result);
        return result;
    } catch (error) {
        console.error("❌ API Error:", error);
        throw error;
    }
};

// Các hàm tiện dụng cho từng resource
export const drugAPI = {
    getAll: () => apiCall("/drugs"),
    getById: (id) => apiCall(`/drugs/${id}`),
    search: (name) => apiCall(`/drugs/search?name=${encodeURIComponent(name)}`),
    create: (data) => apiCall("/drugs/add", "POST", data),
    update: (id, data) => apiCall(`/drugs/${id}`, "PUT", data),
    delete: (id) => apiCall(`/drugs/${id}`, "DELETE"),
};

export const categoryAPI = {
    getAll: () => apiCall("/categories"),
    getById: (id) => apiCall(`/categories/${id}`),
    create: (data) => apiCall("/categories/add", "POST", data),
    update: (id, data) => apiCall(`/categories/${id}`, "PUT", data),
    delete: (id) => apiCall(`/categories/${id}`, "DELETE"),
};

export const userAPI = {
    register: (payload) => apiCall("/users/register", "POST", payload),
    login: (payload) => apiCall("/users/login", "POST", payload),
    getAll: () => apiCall("/users", "GET"),
    getById: (id) => apiCall(`/users/${id}`, "GET"),
    update: (id, payload) => apiCall(`/users/${id}`, "PUT", payload),
    delete: (id) => apiCall(`/users/${id}`, "DELETE"),
    activateAdmin: (payload) => apiCall("/users/activate-admin", "POST", payload),
};

export const orderAPI = {
    getAll: () => apiCall("/orders", "GET"),
    getById: (id) => apiCall(`/orders/${id}`, "GET"),
    create: (payload) => apiCall("/orders", "POST", payload),
    update: (id, payload) => apiCall(`/orders/${id}`, "PUT", payload),
    updateStatus: (id, status) => apiCall(`/orders/${id}/status`, "PUT", { status }),
    delete: (id) => apiCall(`/orders/${id}`, "DELETE"),
    getTopSellers: (period) => apiCall(`/orders/top/${period}`, "GET"),
};

export const invoiceAPI = {
    getAll: () => apiCall("/invoices"),
    getById: (id) => apiCall(`/invoices/${id}`),
    create: (data) => apiCall("/invoices", "POST", data),
    pay: (id, amount) => apiCall(`/invoices/${id}/pay`, "POST", { amount }),
    delete: (id) => apiCall(`/invoices/${id}`, "DELETE"),
};

export const discountAPI = {
  getAll: () => apiCall("/discounts", "GET"),
  getById: (id) => apiCall(`/discounts/${id}`, "GET"),
  create: (payload) => apiCall("/discounts", "POST", payload),
  update: (id, payload) => apiCall(`/discounts/${id}`, "PUT", payload),
  delete: (id) => apiCall(`/discounts/${id}`, "DELETE"),
};