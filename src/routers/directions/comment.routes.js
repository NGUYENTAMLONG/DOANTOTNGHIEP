const express = require("express");
const {
  createComment,
  deleteComment,
  getAllComments,
  editComment,
  likeComment,
  createReply,
  getAllReplies,
  deleteReply,
  likeReply,
} = require("../../controllers/CommentController");
const router = express.Router();
// ****************** Comment *************************
//****** COMMENT *************** */
// Create Comment
router.post("/", createComment);
// router.get("/list", getAllComments);
router.get("/list/:mangaId", getAllComments);
//Delete Comment
router.delete("/:id", deleteComment);
//Like Behaviour
router.patch("/like/:id", likeComment);
//Update Comment
router.patch("/:id", editComment);

//****** REPLY *************** */

router.post("/reply", createReply);

router.patch("/reply/like/:replyId", likeReply);

router.get("/list/reply/:commentId", getAllReplies);

router.delete("/reply/:replyId", deleteReply);

module.exports = router;
