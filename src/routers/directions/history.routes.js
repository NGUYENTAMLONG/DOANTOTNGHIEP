const express = require("express");
const {
  showHistoryWithPostMethod,
  showHistoryWithGetMethod,
  clearVisit,
} = require("../../controllers/HistoryController");

const router = express.Router();

router.post("/", showHistoryWithPostMethod);
router.post("/clear-visits", clearVisit);
router.get("/", showHistoryWithGetMethod);

module.exports = router;
