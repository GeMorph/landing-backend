var express = require("express");
const { getSingleUser, createUser } = require("../controllers/userCtrl");
var router = express.Router();

router.get("/getuser", getSingleUser);
router.post("/signup",  createUser);

module.exports = router;
