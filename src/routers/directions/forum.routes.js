const express = require("express");
const { showForum, showDetail } = require("../../controllers/ForumController");
const router = express.Router();

router.get("/", showForum);
router.get("/detail/:mangaId", showDetail);

module.exports = router;
