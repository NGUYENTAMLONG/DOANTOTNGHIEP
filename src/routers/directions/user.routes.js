const express = require("express");
const { likeManga, unlikeManga } = require("../../controllers/LikeController");
const { rateManga } = require("../../controllers/RateController");
const {
  getUserInfo,
  showProfile,
  showHistory,
  updateUsername,
} = require("../../controllers/UserController");
const router = express.Router();

router.get("/info", getUserInfo);
router.post("/like", likeManga);
router.delete("/unlike", unlikeManga);
router.post("/rate", rateManga);

router.get("/profile", showProfile);
router.get("/history", showHistory);

router.patch("/update/username", updateUsername);
// router.use("/rate", home);
module.exports = router;
