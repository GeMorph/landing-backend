const express = require("express");
const router = express.Router();
const {
  getReports,
  createReport,
  updateReport,
  deleteReport,
} = require("../controllers/reportCtrl");
const { validateToken, validateAdmin } = require("../middlewares/authMiddleware");

// Get all reports
router.get("/", validateToken, getReports);

// Create a new report
router.post("/", validateToken, validateAdmin, createReport);

// Update a report
router.put("/:id", validateToken, validateAdmin, updateReport);

// Delete a report
router.delete("/:id", validateToken, validateAdmin, deleteReport);

module.exports = router;
