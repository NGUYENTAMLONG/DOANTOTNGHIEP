const express = require("express");
const { showDataDashboard } = require("../../../controllers/DataController");
const multer = require("multer");
const appRoot = require("app-root-path");
const path = require("path");
const XLSX = require("xlsx");

const fse = require("fs-extra");
const { STATUS, ERRORCODE, MESSAGE } = require("../../../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../../../helper/response");
const readXlsxFile = require("read-excel-file/node");

const router = express.Router();

// route:-> /management/content/data/...
router.get("/dashboard", showDataDashboard);

const excelFilter = (req, res, next) => {
  if (
    file.mimetype.includes(excel) ||
    file.mimetype.includes("spreadsheetml")
  ) {
    req.file = file;
    next();
  } else {
    return res
      .status(STATUS.BAD_REQUEST)
      .json(
        new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );
  }
};
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(appRoot.path, "/src/public/data"));
  },
  filename: (req, file, cb) => {
    console.log(file);
    req.file = file;
    const filename = Date.now() + path.extname(file.originalname);
    req.filename = filename;
    cb(null, filename);
  },
});

const uploadFile = multer({ storage: excelStorage });
//route (API-JSON): -> /management/content/data/api
// uploadFile.single("file"),
router.post("/api/send-data", uploadFile.single("file"), async (req, res) => {
  // console.log("DSAFDSA");
  // return res.json("DSAFDSA");
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let excelPath = path.join(appRoot.path, "/src/public/data/") + req.filename;
    // return res
    //   .status(STATUS.SUCCESS)
    //   .json(new SuccessResponse(MESSAGE.SUCCESS, excelPath));
    console.log(excelPath);
    readXlsxFile(excelPath).then((rows) => {
      // skip header
      rows.shift();

      let tutorials = [];

      rows.forEach((row) => {
        let tutorial = {
          id: row[0],
          title: row[1],
          description: row[2],
          published: row[3],
        };

        tutorials.push(tutorial);
      });
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, tutorials));
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
});

module.exports = router;
