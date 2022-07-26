const express = require("express");
const {
  showWeeklyChart,
  showDailyChart,
  showMonthlyChart,
} = require("../../controllers/ChartController");

const router = express.Router();

router.get("/daily", showDailyChart);

router.get("/weekly", showWeeklyChart);

router.get("/monthly", showMonthlyChart);

module.exports = router;
