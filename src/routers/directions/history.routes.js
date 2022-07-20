const express = require("express");
const {
  showHistory,
  storeHistoryData,
  clearHistory,
} = require("../../controllers/HistoryController");

const router = express.Router();

router.get("/clear-history", clearHistory);
router.get("/", showHistory);
router.post("/", storeHistoryData);

module.exports = router;
