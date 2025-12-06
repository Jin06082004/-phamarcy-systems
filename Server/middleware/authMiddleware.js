import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.warn("⚠️ No token provided for:", req.path);
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }

  const JWT_SECRET = process.env.JWT_SECRET || "changeme";
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Token verification failed:", err.message);
      console.error("   Token:", token.substring(0, 20) + "...");
      console.error("   Secret:", JWT_SECRET);
      console.error("   Path:", req.path);
      
      return res.status(403).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại",
      });
    }

    console.log("✅ Authenticated user:", user.user_id, "accessing", req.path);
    req.user = user;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    console.warn("⚠️ Access denied - not admin:", req.user?.username);
    return res.status(403).json({
      success: false,
      message: "Yêu cầu quyền admin",
    });
  }
  next();
};

// Middleware: Chỉ admin hoặc pharmacist
export const isAdminOrPharmacist = (req, res, next) => {
  if (!req.user || !["admin", "pharmacist"].includes(req.user.role)) {
    console.warn("⚠️ Access denied - not admin/pharmacist:", req.user?.username, "role:", req.user?.role);
    return res.status(403).json({
      success: false,
      message: "Yêu cầu quyền admin hoặc dược sĩ",
    });
  }
  console.log("✅ Access granted for", req.user.role, ":", req.user.username);
  next();
};
