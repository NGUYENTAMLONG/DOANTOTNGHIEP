const express = require("express");
const {
  show,
  showResult,
} = require("../../controllers/AdvancedSearchController");
const router = express.Router();

router.get("/", show);
router.post("/result", showResult);

module.exports = router;
