const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { SuccessResponse, ErrorResponse } = require("../helper/response");
const { SECRET_KEY } = require("../config/default");
const Comment = require("../models/Comment");
const { GenerateReplyId } = require("../helper/generate");
const Reply = require("../models/Reply");

class CommentController {
  async createComment(req, res) {
    const { content, userId, mangaId, chapter } = req.body;
    const token = req.cookies.token;
    if (!content || !userId || !mangaId || !chapter || !token) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      const verifyUser = jwt.verify(token, SECRET_KEY);
      if (verifyUser.userId !== userId) {
        return res
          .status(STATUS.UNAUTHORIZED)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_UNAUTHORIZED,
              MESSAGE.UNAUTHORIZED
            )
          );
      }
      await Comment.create({
        content,
        userId,
        mangaId,
        chapter: chapter !== "null" ? parseFloat(chapter) : -1,
      });
      const countComment = await Comment.find({
        mangaId: mangaId,
      }).countDocuments();
      console.log(countComment);
      res
        .status(STATUS.CREATED)
        .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, { countComment }));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async createReply(req, res) {
    const { commentId, replyContent, to } = req.body;
    const token = req.cookies.token;
    console.log(commentId, replyContent, to);
    if (!commentId || !replyContent || !to || !token) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }

    try {
      const verifyToken = jwt.verify(token, SECRET_KEY);
      const createdReply = await Reply.create({
        from: verifyToken.userId,
        to,
        replyContent,
      });
      await Comment.findByIdAndUpdate(commentId, {
        $push: { replies: createdReply._id },
      });
      const foundComment = await Comment.findById(commentId);
      const countRepliesOfComment = foundComment.replies.length;
      console.log(countRepliesOfComment);
      res
        .status(STATUS.CREATED)
        .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, { foundComment }));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getAllComments(req, res) {
    const mangaId = req.params.mangaId;
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const endPage = page * limit;
      const result = {};
      if (startPage > 0) {
        result.previous = {
          previousPage: page - 1,
          limit: limit,
        };
      }
      if (endPage < (await Comment.countDocuments().exec())) {
        result.next = {
          nextPage: page + 1,
          limit: limit,
        };
      }
      result.comments = await Comment.find({
        mangaId: mangaId,
      })
        .populate("userId", "username avatar")
        .populate({
          path: "replies",
          populate: [
            {
              path: "from",
            },
            { path: "to" },
          ],
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startPage)
        .exec();
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, result.comments));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async deleteComment(req, res) {
    const commentId = req.params.id;
    const token = req.cookies.token;
    if (!commentId || !token) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      // const verifyUser = jwt.verify(token, SECRET_KEY);
      const foundComment = await Comment.findById(commentId);
      await Comment.findByIdAndDelete(commentId);
      const countComment = await Comment.find({
        mangaId: foundComment.mangaId,
      }).countDocuments();
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, { countComment }));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async editComment(req, res) {
    const commentId = req.params.id;
    const { content } = req.body;
    const token = req.cookies.token;
    if (!commentId || !token) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      await Comment.findByIdAndUpdate(commentId, { content: content });
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async likeComment(req, res) {
    const commentId = req.params.id;
    const { flag } = req.body;
    const token = req.cookies.token;
    if (!commentId || !token) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      const foundComment = await Comment.findById(commentId);
      if (!foundComment) {
        return res
          .status(STATUS.NOT_FOUND)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_NOT_FOUND, MESSAGE.NOT_FOUND)
          );
      }
      if (flag === true) {
        await Comment.findByIdAndUpdate(commentId, {
          likes: foundComment.likes + 1,
        });
      } else {
        await Comment.findByIdAndUpdate(commentId, {
          likes: foundComment.likes - 1,
        });
      }
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, foundComment.likes));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getAllReplies(req, res) {
    const commentId = req.params.commentId;
    try {
      const foundComment = await Comment.findById(commentId).populate({
        path: "replies",
        populate: [
          {
            path: "from",
          },
          { path: "to" },
        ],
      });
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, foundComment));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }

  async deleteReply(req, res) {
    const replyId = req.params.replyId;
    const commentId = req.body.commentId;
    console.log({ commentId, replyId });
    const token = req.cookies.token;
    if (!replyId || !token) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      // const verifyUser = jwt.verify(token, SECRET_KEY);
      const restReplies = await Comment.findByIdAndUpdate(commentId, {
        $pull: { replies: { _id: replyId } },
      }).countDocuments();
      await Reply.findByIdAndDelete(replyId);

      res.status(STATUS.SUCCESS).json(
        new SuccessResponse(MESSAGE.DELETE_SUCCESS, {
          restReplies,
        })
      );
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async likeReply(req, res) {
    const replyId = req.params.replyId;
    const { flag } = req.body;
    const token = req.cookies.token;
    if (!replyId || !token) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      const foundReply = await Reply.findById(replyId);
      if (!foundReply) {
        return res
          .status(STATUS.NOT_FOUND)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_NOT_FOUND, MESSAGE.NOT_FOUND)
          );
      }
      if (flag === true) {
        await Reply.findByIdAndUpdate(replyId, {
          replyLikes: foundReply.replyLikes + 1,
        });
      } else {
        await Reply.findByIdAndUpdate(replyId, {
          replyLikes: foundReply.replyLikes - 1,
        });
      }

      res
        .status(STATUS.SUCCESS)
        .json(
          new SuccessResponse(MESSAGE.UPDATE_SUCCESS, foundReply.replyLikes)
        );
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}
module.exports = new CommentController();
