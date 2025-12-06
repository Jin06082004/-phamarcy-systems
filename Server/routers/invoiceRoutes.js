import { Router } from "express";
import {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    getInvoiceByNumber,
    updateInvoice,
    payInvoice,
    cancelInvoice,
    deleteInvoice,
} from "../controllers/invoiceController.js";
import { authenticateToken, isAdmin, isAdminOrPharmacist } from "../middleware/authMiddleware.js";

const router = Router();

// Create invoice (no auth required for checkout)
router.post("/", createInvoice);

// List invoices (admin or pharmacist)
router.get("/", authenticateToken, isAdminOrPharmacist, getAllInvoices);

// Get by invoice number
router.get("/number/:number", getInvoiceByNumber);

// Get by invoice id
router.get("/:id", getInvoiceById);

// Update invoice (limited operations)
router.put("/:id", updateInvoice);

// Pay invoice (require auth)
router.post("/:id/pay", authenticateToken, payInvoice);

// Cancel invoice
router.post("/:id/cancel", cancelInvoice);

// Delete one (permanent) - admin only
router.delete("/:id", authenticateToken, isAdmin, deleteInvoice);

export default router;
