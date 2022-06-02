const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { SuccessResponse, ErrorResponse } = require("../helper/response");
const { SECRET_KEY } = require("../config/default");
const Comment = require("../models/Comment");

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
      const createdComment = await Comment.create({
        content,
        userId,
        mangaId,
        chapter: chapter !== "null" ? parseFloat(chapter) : -1,
      });

      res
        .status(STATUS.CREATED)
        .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, createdComment));
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

      await Comment.findByIdAndDelete(commentId);

      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}
module.exports = new CommentController();
