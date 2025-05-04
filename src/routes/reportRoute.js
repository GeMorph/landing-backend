const express = require("express");
const router = express.Router();
const {
  getReports,
  createReport,
  updateReport,
  deleteReport,
} = require("../controllers/reportCtrl");

// Get all reports
router.get("/", getReports);

// Create a new report
router.post("/", createReport);

// Update a report
router.put("/:id", updateReport);

// Delete a report
router.delete("/:id", deleteReport);

module.exports = router;
