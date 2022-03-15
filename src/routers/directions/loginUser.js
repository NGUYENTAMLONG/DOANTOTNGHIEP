const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  res.json("XIN CHAO");
});
module.exports = router;
