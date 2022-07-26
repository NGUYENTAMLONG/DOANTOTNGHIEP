const express = require("express");
const { STATUS, ERRORCODE, MESSAGE } = require("../../config/httpResponse");
const { ErrorResponse } = require("../../helper/response");
const Admin = require("../../models/Admin");
const moment = require("moment");
const router = express.Router();

const adminManagementRouter = require("./human/admin.routes");
const userManagementRouter = require("./human/user.routes");
const User = require("../../models/User");
const Manga = require("../../models/Manga");
const Slide = require("../../models/Slide");

//path: /management/human/...
router.use("/admin", adminManagementRouter);
router.use("/user", userManagementRouter);

router.use("/", async (req, res) => {
  Promise.all([Admin.find(), User.find(), Manga.find(), Slide.find()])
    .then(([adminList, userList, mangaList, slideList]) => {
      res.render("admin/humanDashboard", {
        adminList,
        userList,
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
