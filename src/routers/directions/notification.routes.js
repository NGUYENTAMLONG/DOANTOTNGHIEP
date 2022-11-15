const express = require("express");
const { STATUS, ERRORCODE, MESSAGE } = require("../../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../../helper/response");
const { PublicNotification } = require("../../models/Notification");
const moment = require("moment");
const router = express.Router();

router.get("/api/get-list", async (req, res) => {
  try {
    const publicNotifications = await PublicNotification.find()
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .skip(0)
      .exec();
    return res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.SUCCESS, publicNotifications));
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});

router.post("/api/get-list/more", async (req, res) => {
  const { skip } = req.body;
  if (!skip) {
    return res
      .status(STATUS.BAD_REQUEST)
      .json(new ErrorResponse(ERRORCODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));
  }
  try {
    const foundNotifications = await PublicNotification.find()
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .skip(Number(skip))
      .exec();
    res.status(STATUS.SUCCESS).json(
      new SuccessResponse(MESSAGE.SUCCESS, {
        user: req.user,
        notifications: foundNotifications,
      })
    );
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});

router.get("/api/get-all/unread", async (req, res) => {
  try {
    const publicNotifications = await PublicNotification.find({ read: false });
    return res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.SUCCESS, publicNotifications));
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});

router.get("/", async (req, res) => {
  try {
    const publicNotifications = await PublicNotification.find()
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .skip(0)
      .exec();
    return res.status(STATUS.SUCCESS).render("notification", {
      user: req.user,
      publicNotifications: publicNotifications,
      moment,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
module.exports = router;
