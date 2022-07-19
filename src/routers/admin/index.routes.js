const express = require("express");
const router = express.Router();

const contentRouter = require("./content.routes");
const humanRouter = require("./human.routes");

//path: /management/content/...
router.use("/human", humanRouter);

router.use("/content", contentRouter);

module.exports = router;
