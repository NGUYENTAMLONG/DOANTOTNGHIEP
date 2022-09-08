const express = require("express");
const { submitEmail } = require("../../controllers/EmailController");
const router = express.Router();

// router.get("/api/get-all", getAllEmail);
router.post("/api/submit-mail", submitEmail);
// router.post("/api/send-mail", likeManga);
// router.delete("/api/softDelete", unlikeManga);

module.exports = router;
