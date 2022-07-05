const express = require("express");

const router = express.Router();

router.use("/", (req, res) => {
  res.json("HUMAN MANAGEMENT DASHBOARD");
});

module.exports = router;
