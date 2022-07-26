const express = require("express");
const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path");
const {
  showAdminDashboard,
  showAnalysis,
  showUserDashboard,
} = require("../../../controllers/AdminController");

const router = express.Router();

const storageAdmin = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/admins");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadAdmin = multer({ storage: storageAdmin }); //for admin

// route:-> /management/human/admin/...

router.get("/", showAdminDashboard);

//route (API-JSON): -> /management/human/admin/api/...

module.exports = router;
