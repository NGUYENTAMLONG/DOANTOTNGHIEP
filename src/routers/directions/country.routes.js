const express = require("express");
const { show } = require("../../controllers/CountryController");
const router = express.Router();
router.get("/:slug", show);

module.exports = router;
