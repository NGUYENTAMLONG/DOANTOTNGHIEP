const express = require("express");
const { getUserInfo } = require("../../controllers/UserController");
const router = express.Router();

router.get("/info", getUserInfo);
// router.post("/follow", liveSearch);
// router.post("/like", search);
// router.use("/rate", home);
module.exports = router;
