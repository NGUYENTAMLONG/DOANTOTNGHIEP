const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const { PublicNotification } = require("../models/Notification");

async function storePublicNotification(res, notification) {
  try {
    const savedPublicNotification = await PublicNotification.create({
      name: notification.name,
      image: notification.image,
      content: notification.content,
      fromUser: notification.fromUser,
      url: notification.url,
    });
    return savedPublicNotification;
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
}

module.exports = {
  storePublicNotification,
};
