import { Router } from "express";
import {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    getInvoiceByNumber,
    updateInvoice,
    payInvoice,
    cancelInvoice,
    deleteAllInvoices,
    deleteInvoice,
} from "../controllers/invoiceController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

// Create invoice (no auth required for checkout)
router.post("/", createInvoice);

// List invoices (admin)
router.get("/", authenticate, authorizeRoles('admin'), getAllInvoices);

// Get by invoice number
router.get("/number/:number", getInvoiceByNumber);

// Get by invoice id
router.get("/:id", getInvoiceById);

// Update invoice (limited operations)
router.put("/:id", updateInvoice);

// Pay invoice (require auth)
router.post("/:id/pay", authenticate, payInvoice);

// Cancel invoice
router.post("/:id/cancel", cancelInvoice);

// Delete all (dev) - admin only
router.delete("/all", authenticate, authorizeRoles('admin'), deleteAllInvoices);

// Delete one (permanent) - admin only
router.delete("/:id", authenticate, authorizeRoles('admin'), deleteInvoice);

export default router;
