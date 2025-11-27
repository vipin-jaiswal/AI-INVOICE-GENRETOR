// routes/invoiceRoutes.js

const express = require("express");
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// POST   /api/invoices        → Create new invoice
// GET    /api/invoices        → Get all invoices of logged-in user
router
  .route("/")
  .post(protect, createInvoice)
  .get(protect, getInvoices);

// GET    /api/invoices/:id        → Get single invoice
// PUT    /api/invoices/:id     → Update invoice
// DELETE /api/invoices/:id     → Delete invoice
router
  .route("/:id")
  .get(protect, getInvoiceById)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);

module.exports = router;