const express = require("express");
const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path");
const {
  showUserDashboard,
  getUserList,
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

//route (API-JSON): -> /management/human/user/api/...
router.get("/api/getList", getUserList);

module.exports = router;
