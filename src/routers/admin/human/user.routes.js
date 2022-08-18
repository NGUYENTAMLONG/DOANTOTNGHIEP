const express = require("express");
const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path");
const {
  showUserDashboard,
  showUserTrash,
  getUserList,
  softDeleteUser,
  softDeleteCheckedUser,
  getDeletedUsers,
  restoreUser,
  restoreCheckedUser,
} = require("../../../controllers/AdminController");

const router = express.Router();

const storageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/users");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadUser = multer({ storage: storageUser }); //for user

// route:-> /management/human/user/...
router.get("/", showUserDashboard);
router.get("/trash", showUserTrash);

router.delete("/softDelete/:id", softDeleteUser);
router.delete("/softDeleteChecked", softDeleteCheckedUser);
router.patch("/restoreChecked", restoreCheckedUser);
router.patch("/restore/:id", restoreUser);

//route (API-JSON): -> /management/human/user/api/...
router.get("/api/getList", getUserList);
router.get("/api/getDeletedUsers", getDeletedUsers);

module.exports = router;
