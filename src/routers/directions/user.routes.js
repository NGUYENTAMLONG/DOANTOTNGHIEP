const express = require("express");
const { likeManga, unlikeManga } = require("../../controllers/LikeController");
const { rateManga } = require("../../controllers/RateController");
const userBlogRouter = require("./userBlog.routes");
const {
  getUserInfo,
  showProfile,
  checkFollow,
  showHistory,
  updateUsername,
  updateDob,
  updateAvatar,
  alertError,
  getRetrievalPage,
  submitMailToRetrievalPassword,
  getFormRecoverPassword,
  submitRecoverPassword,
  updateGender,
  updatePasswordInProfile
} = require("../../controllers/UserController");
const { decodeBase64 } = require("../../middleware/handleBase64");
const router = express.Router();

router.get("/info", getUserInfo);
router.post("/like", likeManga);
router.delete("/unlike", unlikeManga);
router.post("/rate", rateManga);
router.get("/profile", showProfile);
router.get("/history", showHistory);
router.get("/check-follow/:id", checkFollow);

router.patch("/update-username", updateUsername);
router.patch("/update-dob", updateDob);
router.patch("/update-gender", updateGender);
router.patch("/update-avatar", decodeBase64, updateAvatar);
router.patch("/update-password", updatePasswordInProfile);

router.post("/alert-error", alertError);
router.get("/retrieval", getRetrievalPage);
router.post("/retrieval", submitMailToRetrievalPassword);

router.post("/recover/password", getFormRecoverPassword);
router.patch("/recover/password", submitRecoverPassword);

router.use("/blog", userBlogRouter);

module.exports = router;
