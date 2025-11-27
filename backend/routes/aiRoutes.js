const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  parseInvoiceFromText,
  generateReminderEmail,
  getDashboardSummary,
} = require("../controllers/aiController");

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/parse-text", parseInvoiceFromText);
router.post("/generate-reminder", generateReminderEmail);
router.get("/dashboard-summary", getDashboardSummary);

module.exports = router;
