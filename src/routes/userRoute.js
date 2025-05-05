var express = require("express");
const {
  getUser,
  createUser,
  getUserByEmail,
  getAllUsers,
} = require("../controllers/userCtrl");
const { validateToken, validateAdmin } = require("../middlewares/authMiddleware");
var router = express.Router();

// Protected routes - require authentication
router.get("/getuser", validateToken, getUser);
// Public routes - no authentication required
router.get("/email/:email", getUserByEmail);
router.post("/signup", validateToken, createUser);
router.get("/allusers", validateToken, validateAdmin, getAllUsers);

module.exports = router;
