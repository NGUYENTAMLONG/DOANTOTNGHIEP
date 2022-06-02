const express = require("express");
const { show } = require("../../controllers/CategoryController");
const router = express.Router();
router.get("/:type", show);
module.exports = router;
