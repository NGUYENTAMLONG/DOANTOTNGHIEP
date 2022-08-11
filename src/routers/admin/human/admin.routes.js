const express = require("express");
const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path");
const {
  showAdminDashboard,
  showAdminTrash,
  softDeleteAdmin,
  softDeleteCheckedAdmin,
  restoreAdmin,
  restoreCheckedAdmin,
  showAnalysis,
  showUserDashboard,
  getAdminList,
  createAdmin,
  getDeletedAdmins,
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

// Get Admin Trash Table
// route:-> /management/human/admin/trash...
router.get("/trash", showAdminTrash);
// Get Admin Table
// route:-> /management/human/admin/...
router.get("/", showAdminDashboard);

// Soft Delete Admin
// route:-> /management/human/admin/softDelete/:id...
router.delete("/softDelete/:id", softDeleteAdmin);

// Soft Delete Checked Admin
// route:-> /management/human/admin/softDeleteChecked
router.delete("/softDeleteChecked", softDeleteCheckedAdmin);

// Restore Admin
// route:-> /management/human/admin/restore/:id...
router.patch("/restore/:id", restoreAdmin);

// Restore Checked Admin
// route:-> /management/human/admin/restore/:id...
router.patch("/restoreChecked", restoreCheckedAdmin);

//route (API-JSON): -> /management/human/admin/...
router.get("/api/getList", getAdminList);
router.get("/api/getDeletedAdmins", getDeletedAdmins);
router.post("/api/create", createAdmin);

module.exports = router;
