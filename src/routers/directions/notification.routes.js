const express = require("express");
const moment = require("moment");
const {
  getPublicNotifications,
  getMorePublicNotifications,
  getPrivateNotifications,
  getMorePrivateNotifications,
  getAllNotifications,
} = require("../../controllers/NotificationController");
const router = express.Router();

router.get("/api/get-list/public", getPublicNotifications);
router.post("/api/get-list/public/more", getMorePublicNotifications);
router.get("/api/get-list/private", getPrivateNotifications);
router.post("/api/get-list/private/more", getMorePrivateNotifications);
router.get("/", getAllNotifications);

module.exports = router;
