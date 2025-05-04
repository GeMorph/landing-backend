const express = require("express");
const router = express.Router();
const {
  getCases,
  getCaseById,
  submitCase,
  updateCase,
  deleteCase,
} = require("../controllers/caseCtrl");

// Get all cases
router.get("/", getCases);

// Get single case
router.get("/:id", getCaseById);

// Submit new case
router.post("/submit", submitCase);

// Update case
router.put("/:id", updateCase);

// Delete case
router.delete("/:id", deleteCase);

module.exports = router;
