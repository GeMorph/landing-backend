var express = require("express");
var router = express.Router();
const { submitCase } = require("../controllers/caseCtrl");

router.post("/submit", submitCase);

module.exports = router;
