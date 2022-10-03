const express = require("express");
const {
  showHistoryWithPostMethod,
  showHistoryWithGetMethod,
  clearVisit,
  clearVisitJustOne,
  clearVisitOfUser,
} = require("../../controllers/HistoryController");

const router = express.Router();

router.post("/", showHistoryWithPostMethod);
router.post("/clear-visits", clearVisit);
router.delete("/clear-visit/:manga", clearVisitJustOne);
router.delete("/clear-history-user/:id", clearVisitOfUser);
router.get("/", showHistoryWithGetMethod);

module.exports = router;
