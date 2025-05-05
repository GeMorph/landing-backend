const express = require("express");
const router = express.Router();
const {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  getReportById,
} = require("../controllers/reportCtrl");
const {
  validateToken,
  validateAdmin,
} = require("../middlewares/authMiddleware");

// Get all reports
router.get("/", validateToken, getReports);

// Create a new report
router.post("/", validateToken, validateAdmin, createReport);

// Update a report
router.put("/:id", validateToken, validateAdmin, updateReport);

// Delete a report
router.delete("/:id", validateToken, validateAdmin, deleteReport);

// Get report by ID
router.get("/:id", validateToken, getReportById);

module.exports = router;
