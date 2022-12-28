const express = require("express");
const { showDataDashboard } = require("../../../controllers/DataController");
const multer = require("multer");
const appRoot = require("app-root-path");
const path = require("path");
const fse = require("fs-extra");
const { STATUS, ERRORCODE, MESSAGE } = require("../../../config/httpResponse");
const { ErrorResponse } = require("../../../helper/response");

const router = express.Router();

const upload = multer({ dest: path.join(appRoot.path, "/src/public/data") });
// route:-> /management/content/data/...
router.get("/dashboard", showDataDashboard);

//route (API-JSON): -> /management/content/data/api
router.post("/read", upload.single("file"), (req, res) => {
  try {
    if (req.file?.filename === null || req.file?.filename === undefined) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(
            ERRORCODE.ERROR_BAD_REQUEST,
            MESSAGE.BAD_REQUEST_FILE
          )
        );
    } else {
      const filePath = "public" + req.file.filename;
    }
  } catch (error) {}
});

module.exports = router;
