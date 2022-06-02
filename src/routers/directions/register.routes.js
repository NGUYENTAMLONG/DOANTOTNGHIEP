const express = require("express");
const {
  Register,
  AuthenAccount,
} = require("../../controllers/AccountController");
const Comment = require("../../models/Comment");
const router = express.Router();

router.post("/authentication", AuthenAccount);
router.post("/", Register);
router.post("/test", async (req, res) => {
  const { mangaId, userId, content, chapter } = req.body;
  try {
    const createdComment = await Comment.create({
      mangaId,
      userId,
      content,
      chapter,
    });
    res.status(201).json(createdComment);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
router.get("/test2", async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("mangaId", "_id")
      .populate("userId", "_id");
    res.status(201).json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
module.exports = router;
