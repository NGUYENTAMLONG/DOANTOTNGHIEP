const express = require("express");
const { showHumanAnalysis } = require("../../../controllers/HumanController");

const router = express.Router();

// route:-> /management/human/analysis/...
router.get("/", showHumanAnalysis);

module.exports = router;
