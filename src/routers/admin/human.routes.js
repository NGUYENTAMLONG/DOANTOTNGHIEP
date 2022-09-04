const express = require("express");
const { STATUS, ERRORCODE, MESSAGE } = require("../../config/httpResponse");
const { ErrorResponse } = require("../../helper/response");
const Admin = require("../../models/Admin");
const moment = require("moment");
const router = express.Router();

const adminManagementRouter = require("./human/admin.routes");
const userManagementRouter = require("./human/user.routes");
const analysisRouter = require("./human/analysis.routes");
const UserLocal = require("../../models/UserLocal");
const UserFacebook = require("../../models/UserFacebook");
const UserGoogle = require("../../models/UserGoogle");
const { showInfomationAdmin } = require("../../controllers/AdminController");
const {
  changeUsernameInfoAdmin,
  changeRoleInfoAdmin,
  changePasswordInfoAdmin,
  changeEmailInfoAdmin,
  changeAvatarInfoAdmin,
} = require("../../controllers/InfomationController");

//path: /management/human/...
router.use("/admin", adminManagementRouter);
router.use("/user", userManagementRouter);
router.use("/analysis", analysisRouter);

//path: /management/human/infomation...
router.get("/infomation", showInfomationAdmin);
router.patch("/api/change/avatar", changeAvatarInfoAdmin);
router.patch("/api/change/username", changeUsernameInfoAdmin);
router.patch("/api/change/role", changeRoleInfoAdmin);
router.patch("/api/change/password", changePasswordInfoAdmin);
router.patch("/api/change/email", changeEmailInfoAdmin);

router.use("/", async (req, res) => {
  Promise.all([
    Admin.find(),
    UserLocal.find(),
    UserFacebook.find(),
    UserGoogle.find(),
  ])
    .then(([adminList, userLocalList, userFacebookList, userGoogleList]) => {
      res.render("admin/humanDashboard", {
        admin: req.user,
        adminList,
        userLocalList,
        userFacebookList,
        userGoogleList,
        moment,
      });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE, MESSAGE.ERROR_SERVER));
    });
});

module.exports = router;
