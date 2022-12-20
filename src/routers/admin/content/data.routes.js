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

const Manga = require("../../../models/Manga");
const Slide = require("../../../models/Slide");

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

router.post("/api/export-data/:slug", async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    return res
      .status(STATUS.BAD_REQUEST)
      .json(new ErrorResponse(ERRORCODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));
  }
  const wb = XLSX.utils.book_new();
  let dataModel = null;
  if (slug === "manga") {
    dataModel = Manga;
  } else if (slug === "slide") {
    dataModel = Slide;
  }
  // dataModel.find((err, data) => {
  //   if (condition) {
  //   }
  // });
  try {
    const foundData = await dataModel.find();
    //export excel file
    let temp = JSON.stringify(foundData);
    temp = JSON.parse(temp);
    const ws = XLSX.utils.json_to_sheet(temp);
    // const down = __dirname + "/public/exportdata.xlsx";
    const down = path.join(appRoot.path, "/src/public/data/exportdata.xlsx");
    XLSX.utils.book_append_sheet(wb, ws, "sheet1");
    XLSX.writeFile(wb, down);
    return res.download(down);
    res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.SUCCESS, foundData));
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.SERVER_ERROR, MESSAGE.ERROR_SERVER));
  }
});

module.exports = router;
