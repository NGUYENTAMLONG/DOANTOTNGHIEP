const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { redirect } = require("../service/redirect");
const { SuccessResponse, ErrorResponse } = require("../helper/response");
const fs = require("fs");
const appRoot = require("app-root-path");
const path = require("path");
const moment = require("moment");
const {
  PublicNotification,
  PrivateNotification,
} = require("../models/Notification");
const { storePublicNotification } = require("../service/storeNotification");
const { NOTIFICATION } = require("../config/default");
const { handleSocket } = require("../service/socketIO");
const pagination = require("../service/pagination");

class NotificationController {
  //Go to notification dashboard
  async getNotificationDashboard(req, res) {
    try {
      const totalNotification = await PublicNotification.countDocuments();
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 2;
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalNotification);
      result.publicNotifications = await PublicNotification.find()
        .limit(limit)
        .skip(startPage)
        .exec();

      // // const privateNotifications = await PrivateNotification.find();
      // return res.json({
      //   admin: req.user,
      //   moment,
      //   publicNotifications: result.publicNotifications,
      //   navigator: {
      //     previous: result.previous,
      //     next: result.next,
      //     totalPages: Math.ceil(totalNotification / limit),
      //     limit: limit,
      //     activePage: page,
      //   },
      //   // privateNotifications,
      // });
      res.render("admin/notification/notificationDashboard", {
        admin: req.user,
        moment,
        publicNotifications: result.publicNotifications,
        navigator: {
          previous: result.previous,
          next: result.next,
          totalPages: Math.ceil(totalNotification / limit),
          limit: limit,
          activePage: page,
        },
        // privateNotifications,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async createNotification(req, res, next) {
    const { name, content, url } = req.body;
    if (!name || !content) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      const payload = {
        name,
        content,
        url,
        fromUser: req.user,
      };
      if (req.file) {
        payload.image = "/public/notification/" + req.file.filename;
      }
      const createdNotification = await PublicNotification(payload);
      //Notification
      await storePublicNotification(res, {
        name: NOTIFICATION.PUBLIC.NAME.EXCEPTION,
        image: createdNotification.image,
        content: createdNotification.content,
        fromUser: req.user,
        url: url ? url : createdNotification.name + Date.now(),
      });

      handleSocket(req.io, NOTIFICATION.PUBLIC.SPACE.EXCEPTION, {
        name: NOTIFICATION.PUBLIC.SPACE.EXCEPTION,
        image: createdNotification.image,
        content: createdNotification.content,
        url: url ? url : createdNotification.name + Date.now(),
      });
      //
      return res
        .status(STATUS.CREATED)
        .json(new SuccessResponse(MESSAGE.SUCCESS, createdNotification));
    } catch (error) {
      console.log(error);
      //rollback
      if (req.file) {
        fs.unlinkSync(
          path.join(
            appRoot.path,
            `/src/public/notification/${req.file.filename}`
          )
        );
      }

      if (error.code === 11000) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.URL_ALREADY)
          );
      }
      return res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new NotificationController();
