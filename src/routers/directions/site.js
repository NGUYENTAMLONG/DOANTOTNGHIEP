const express = require("express");
const { home, blogs } = require("../../controllers/SiteController");
const router = express.Router();
router.use("/blogs", blogs);
router.use("/", home);

module.exports = router;
