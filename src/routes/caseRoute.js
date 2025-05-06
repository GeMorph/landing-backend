const express = require("express");
const router = express.Router();
const {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  getCasesByUserId,
} = require("../controllers/caseCtrl");
const {
  validateToken,
  validateAdmin,
} = require("../middlewares/authMiddleware");

// Get all cases
router.get("/", validateToken, getCases);

// Get cases by user ID
router.get("/user/:userId", validateToken, getCasesByUserId);

// Get single case
router.get("/:id", validateToken, getCaseById);

// Create a new case
router.post("/", validateToken, createCase);

// Update a case - only admin can update
router.put("/:id", validateToken, validateAdmin, updateCase);

// Delete a case - only admin can delete
router.delete("/:id", validateToken, validateAdmin, deleteCase);

module.exports = router;
