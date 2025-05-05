var express = require("express");
const {
  getSingleUser,
  createUser,
  getUserByEmail,
} = require("../controllers/userCtrl");
const { validateToken } = require("../middlewares/authMiddleware");
var router = express.Router();

// Protected routes - require authentication
router.get("/getuser", validateToken, getSingleUser);
// Public routes - no authentication required
router.get("/email/:email", getUserByEmail);
router.post("/signup", validateToken, createUser);

module.exports = router;
