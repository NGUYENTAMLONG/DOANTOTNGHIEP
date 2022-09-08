const express = require("express");
const {
  getCreateMailPage,
  getMailDashboard,
  getMailTrash,
  getMailList,
  getDeletedList,
  deleteMail,
  restoreMail,
  deleteMailChecked,
  restoreMailChecked,
} = require("../../../controllers/EmailController");
const router = express.Router();

// route:-> /management/content/mail/...
router.get("/send-mail", getCreateMailPage);
router.get("/trash", getMailTrash);
router.get("/", getMailDashboard);

//route (API-JSON): -> /management/content/mail/api
// router.post("/api/send-mail", sendMail);
router.get("/api/getList", getMailList);
router.get("/api/getDeletedList", getDeletedList);
router.delete("/api/delete/:id", deleteMail);
// router.delete("/api/destroy/:id", destroyMail);
router.patch("/api/restore/:id", restoreMail);
router.delete("/api/deleteChecked", deleteMailChecked);
router.patch("/api/restoreChecked", restoreMailChecked);

module.exports = router;
