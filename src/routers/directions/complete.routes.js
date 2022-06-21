const express = require("express");
const { show } = require("../../controllers/Complete.Controller");
const router = express.Router();
router.get("/", show);

module.exports = router;
