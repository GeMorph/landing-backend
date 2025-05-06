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

// Get single report
router.get("/:id", validateToken, getReportById);

// Create a new report
router.post("/", validateToken, validateAdmin, createReport);

// Update a report
router.put("/:id", validateToken, validateAdmin, updateReport);

// Delete a report
router.delete("/:id", validateToken, validateAdmin, deleteReport);

module.exports = router;
