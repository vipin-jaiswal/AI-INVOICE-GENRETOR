const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  parseInvoiceFromText,
  generateReminderEmail,
  getDashboardSummary,
  generateInvoiceFromModel,
  generateInvoiceFromTextSimple,
} = require("../controllers/aiController");

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/parse-invoice-text", parseInvoiceFromText);
router.post("/parse-invoice-text-simple", generateInvoiceFromTextSimple);
router.post("/generate-from-model", generateInvoiceFromModel);
router.post("/generate-reminder", generateReminderEmail);
router.get("/dashboard-summary", getDashboardSummary);

module.exports = router;
