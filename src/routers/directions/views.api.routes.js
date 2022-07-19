const express = require("express");
const { STATUS, MESSAGE } = require("../../config/httpResponse");
const { SuccessResponse } = require("../../helper/response");
const View = require("../../models/View");
const { redirect } = require("../../service/redirect");
const router = express.Router();
router.post("/", async (req, res) => {
  const { type, check } = req.body;
  try {
    await View.findOneAndUpdate(
      { check: check, type: type },
      { $inc: { count: 1 } }
    );
    res.status(STATUS.SUCCESS).json(new SuccessResponse(MESSAGE.SUCCESS, null));
  } catch (error) {
    console.log(error);
    redirect(req, res, STATUS.SERVER_ERROR);
  }
});

module.exports = router;
