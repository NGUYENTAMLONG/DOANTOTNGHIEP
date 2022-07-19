const express = require("express");
const { showNewManga } = require("../../controllers/FilterController");
const { showJustUpdated } = require("../../controllers/JustUpdatedController");
const router = express.Router();

router.get("/", showJustUpdated);

router.get("/", showNewManga);

module.exports = router;
