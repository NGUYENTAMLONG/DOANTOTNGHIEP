const express = require("express");
const {
  showTodayTop,
  showWeekTop,
  //   showMonthTop,
} = require("../../controllers/TopController");

const router = express.Router();

router.get("/today", showTodayTop);

router.get("/week", showWeekTop);

// router.get("/month", showMonthTop);

module.exports = router;
