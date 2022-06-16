const express = require("express");
const {
  showFollowManga,
  addFollowManga,
  unFollowManga,
} = require("../../controllers/FollowController");
const router = express.Router();

router.get("/", showFollowManga);
router.post("/", addFollowManga);
router.delete("/", unFollowManga);

module.exports = router;
