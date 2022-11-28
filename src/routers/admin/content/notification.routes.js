const express = require("express");
const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path");
const {
  getNotificationDashboard,
  getNotificationTrash,
  createNotification,
  deleteNotification,
  restoreNotification,
  getAuthorNotification,
  updateNotification,
  deleteChecked,
  restoreChecked,
  searchNotification,
} = require("../../../controllers/NotificationController");
const router = express.Router();

// route:-> /management/content/notification/...
// router.get("/update/:id", getUpdateNotificationPage);
// router.get("/create", getCreateNotificationPage);
router.get("/trash", getNotificationTrash);
// router.get("/paging", getPagingNotification);
router.get("/", getNotificationDashboard);
router.get("/searching", searchNotification);
//route (API-JSON): -> /management/content/notification/api
const storageNotification = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(appRoot.path, "/src/public/notification"));
  },
  filename: (req, file, cb) => {
    req.file = file;
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadNotification = multer({ storage: storageNotification });

// router.post(
//   "/api/upload/notificationImg",
//   uploadNotification.single("notification"),
//   async (req, res) => {
//     const { name, content, url } = req.body;
//     console.log(req.body);
//     res.json({ name, content, url });
//   }
// );
router.post(
  "/api/create",
  uploadNotification.single("notification"),
  createNotification
);
router.delete("/api/delete/:id", deleteNotification);
// router.get("/api/getList", getSlideList);
// router.get("/api/getDeletedList", getDeletedList);
// router.get("/api/slides", findAllSlides);
// router.get("/api/slides/:id", findSlideById);
// router.delete("/api/destroy/:id", destroySlide);
router.patch("/api/restore/:id", restoreNotification);
router.get("/api/get-author/:id", getAuthorNotification);
router.patch(
  "/api/update/:id",
  uploadNotification.single("notification"),
  updateNotification
);
// router.put("/api/switch/:id", switchSlide);
router.delete("/api/delete-checked", deleteChecked);
router.patch("/api/restore-checked", restoreChecked);
module.exports = router;
