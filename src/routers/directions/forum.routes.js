const express = require("express");
const { showForum } = require("../../controllers/ForumController");
const router = express.Router();

router.get("/", showForum);

module.exports = router;
