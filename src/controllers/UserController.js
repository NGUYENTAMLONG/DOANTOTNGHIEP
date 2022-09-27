const dotenv = require("dotenv");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
const bcrypt = require("bcrypt");
const { VALUES, types, PASSPORT } = require("../config/default");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const { redirect } = require("../service/redirect");
const UserLocal = require("../models/UserLocal");
const UserFacebook = require("../models/UserFacebook");
const UserGoogle = require("../models/UserGoogle");
const Manga = require("../models/Manga");
const History = require("../models/History");
const filterMangas = require("../service/filterMangas");
const pagination = require("../service/pagination");
const {
  ValidateBlank,
  ValidatePassword,
} = require("../helper/validate.helper");
const {
  sendMailToFix,
  sendMailToRetrievalPassword,
} = require("../service/sendMail");
const Blog = require("../models/Blog");
dotenv.config();

let Useremail;
class UserController {
  async getUserInfo(req, res) {
    try {
      let UserInfo;
      if (req.user.provider === "LOCAL") {
        UserInfo = await UserLocal.findById(req.user.id);
      } else if (req.user.provider === "GOOGLE") {
        UserInfo = await UserGoogle.findById(req.user.id);
      } else if (req.user.provider === "FACEBOOK") {
        UserInfo = await UserFacebook.findById(req.user.id);
      }

      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, UserInfo));
    } catch (error) {
      console.log("ERROR (USERCONTROLLER): ", error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showProfile(req, res) {
    try {
      let foundUser;
      if (req.user.provider === "LOCAL") {
        foundUser = await UserLocal.findById(req.user.id);
      } else if (req.user.provider === "GOOGLE") {
        foundUser = await UserGoogle.findById(req.user.id);
      } else if (req.user.provider === "FACEBOOK") {
        foundUser = await UserFacebook.findById(req.user.id);
      }
      res.status(STATUS.SUCCESS).render("profile", { user: foundUser, moment });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.UNAUTHORIZED);
    }
  }
  async showHistory(req, res) {
    try {
      let foundUser;
      if (req.user.provider === "LOCAL") {
        foundUser = await UserLocal.findById(req.user.id);
      } else if (req.user.provider === "GOOGLE") {
        foundUser = await UserGoogle.findById(req.user.id);
      } else if (req.user.provider === "FACEBOOK") {
        foundUser = await UserFacebook.findById(req.user.id);
      }

      const mangaVisited = await History.findById(foundUser.history);
      const idList = mangaVisited.mangaList.map((item) => item.mangaId);
      const mangas = await Manga.find({ _id: { $in: idList } });
      // res.status(STATUS.SUCCESS).render("showVisited", { user: UserInfo });

      const match = filterMangas(req);
      match._id = { $in: mangas };
      const totalMangas = await Manga.countDocuments(match);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find(match)
        .populate({
          path: "contentId",
          options: {
            chapters: { $slice: -1 },
          },
        })
        .limit(limit)
        .skip(startPage)
        .exec();
      // return res.json(result.mangas);
      res.render("showHistory", {
        user: req.user,
        moment,
        flag: true,
        title: `<i class="fas fa-compass"></i> Các bộ truyện bạn đã ghé thăm`,
        categories: types,
        mangas: result.mangas,
        navigator: {
          previous: result.previous,
          next: result.next,
          totalPages: Math.ceil(totalMangas / limit),
          limit: limit,
          activePage: page,
          filter: match,
        },
      });
      // res.status(STATUS.SUCCESS).json({ mangas });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.UNAUTHORIZED);
    }
  }
  async updateUsername(req, res) {
    const { username } = req.body;
    // return res.json(new SuccessResponse(MESSAGE.SUCCESS, username));
    //Validate Blank
    if (!ValidateBlank(username)) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(
            ERRORCODE.ERROR_BAD_REQUEST,
            MESSAGE.ERROR_WHITE_SPACE
          )
        );
    }
    try {
      let foundUser;
      if (req.user.provider === "LOCAL") {
        foundUser = await UserLocal.findById(req.user.id);
        const checkUsername = await UserLocal.findOne({ username: username });
        if (checkUsername) {
          return res
            .status(STATUS.BAD_REQUEST)
            .json(
              new ErrorResponse(
                ERRORCODE.ERROR_ALREADY_EXISTS,
                MESSAGE.USERNAME_ALREADY
              )
            );
        }
        await UserLocal.findByIdAndUpdate(foundUser._id, {
          username: username,
        });
        return res
          .status(STATUS.SUCCESS)
          .json(new SuccessResponse(MESSAGE.SUCCESS, null));
      } else if (req.user.provider === "GOOGLE") {
        foundUser = await UserGoogle.findById(req.user.id);
        await UserGoogle.findByIdAndUpdate(foundUser._id, {
          username: username,
        });
      } else if (req.user.provider === "FACEBOOK") {
        foundUser = await UserFacebook.findById(req.user.id);
        await UserFacebook.findByIdAndUpdate(foundUser._id, {
          username: username,
        });
      }

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
  async updateDob(req, res) {
    const { dob } = req.body;
    if (!dob) {
      return res
        .status(STATUS.SUCCESS)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      let foundUser;
      if (req.user.provider === "LOCAL") {
        foundUser = await UserLocal.findById(req.user.id);
        await UserLocal.findByIdAndUpdate(foundUser._id, {
          dob: dob,
        });
      } else if (req.user.provider === "GOOGLE") {
        foundUser = await UserGoogle.findById(req.user.id);
        await UserGoogle.findByIdAndUpdate(foundUser._id, {
          dob: dob,
        });
      } else if (req.user.provider === "FACEBOOK") {
        foundUser = await UserFacebook.findById(req.user.id);
        await UserFacebook.findByIdAndUpdate(foundUser._id, {
          dob: dob,
        });
      }

      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SUCCESS)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async updateAvatar(req, res) {
    try {
      let foundUser;
      if (req.user.provider === "LOCAL") {
        foundUser = await UserLocal.findById(req.user.id);
        await UserLocal.findByIdAndUpdate(foundUser._id, {
          avatar: req.avatar,
        });
        const pathAvatar = path.join(appRoot.path, `/src${foundUser.avatar}`);
        fs.unlinkSync(pathAvatar);
      } else if (req.user.provider === "GOOGLE") {
        foundUser = await UserGoogle.findById(req.user.id);
        await UserGoogle.findByIdAndUpdate(foundUser._id, {
          avatar: req.avatar,
        });
        const pathAvatar = path.join(appRoot.path, `/src${foundUser.avatar}`);
        fs.unlinkSync(pathAvatar);
      } else if (req.user.provider === "FACEBOOK") {
        foundUser = await UserFacebook.findById(req.user.id);
        await UserFacebook.findByIdAndUpdate(foundUser._id, {
          avatar: req.avatar,
        });
        const pathAvatar = path.join(appRoot.path, `/src${foundUser.avatar}`);
        fs.unlinkSync(pathAvatar);
      }

      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SUCCESS)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async updatePassword(req, res) {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res
        .status(STATUS.SUCCESS)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      //Test Password
      if (!ValidatePassword(newPassword)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_BAD_REQUEST,
              MESSAGE.PASSWORD_INVALID
            )
          );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await UserLocal.findOneAndUpdate(
        { email: Useremail },
        { password: hashedPassword }
      );
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SUCCESS)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async checkFollow(req, res) {
    const mangaId = req.params.id;
    try {
      let result;
      if (req.user) {
        if (req.user.provider === PASSPORT.LOCAL) {
          result = await UserLocal.findById(req.user.id, {
            followedList: { $elemMatch: { $eq: mangaId } },
          });
        }
        if (req.user.provider === PASSPORT.GOOGLE) {
          result = await UserGoogle.findById(req.user.id, {
            followedList: { $elemMatch: { $eq: mangaId } },
          });
        }
        if (req.user.provider === PASSPORT.FACEBOOK) {
          result = await UserFacebook.findById(req.user.id, {
            followedList: { $elemMatch: { $eq: mangaId } },
          });
        }
      } else {
        return res
          .status(STATUS.NOT_FOUND)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_NOT_FOUND, MESSAGE.NOT_FOUND)
          );
      }
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, result));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async updateGender(req, res) {
    const { gender } = req.body;
    if (!gender) {
      return res
        .status(STATUS.SUCCESS)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      let foundUser;
      if (req.user.provider === "LOCAL") {
        foundUser = await UserLocal.findById(req.user.id);
        await UserLocal.findByIdAndUpdate(foundUser._id, {
          gender: gender,
        });
      } else if (req.user.provider === "GOOGLE") {
        foundUser = await UserGoogle.findById(req.user.id);
        await UserGoogle.findByIdAndUpdate(foundUser._id, {
          gender: gender,
        });
      } else if (req.user.provider === "FACEBOOK") {
        foundUser = await UserFacebook.findById(req.user.id);
        await UserFacebook.findByIdAndUpdate(foundUser._id, {
          gender: gender,
        });
      }

      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SUCCESS)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async alertError(req, res) {
    const { fromEmail, content } = req.body;
    if (!fromEmail || !content) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      await sendMailToFix(fromEmail, content);
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SEND_MAIL_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SUCCESS)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getRetrievalPage(req, res) {
    try {
      res.render("retrieval", {
        user: req.user,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async submitMailToRetrievalPassword(req, res) {
    const { email } = req.body;
    if (!email) {
      return res
        .status(STATUS.SUCCESS)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      const foundUser = await UserLocal.findOne({ email: email });
      if (!foundUser) {
        return res
          .status(STATUS.SUCCESS)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_NOT_FOUND, MESSAGE.NOT_FOUND)
          );
      }
      Useremail = email;
      await sendMailToRetrievalPassword(email);
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SEND_MAIL_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SUCCESS)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getFormRecoverPassword(req, res) {
    if (!req.body.email) {
      redirect(req, res, STATUS.UNAUTHORIZED);
    }
    return res.status(STATUS.SUCCESS).render("recover");
  }

  async submitRecoverPassword(req, res) {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res
        .status(STATUS.SUCCESS)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      //Test Password
      if (!ValidatePassword(newPassword)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_BAD_REQUEST,
              MESSAGE.PASSWORD_INVALID
            )
          );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      if (!Useremail) {
        console.log("Useremail", Useremail);
        res
          .status(STATUS.SUCCESS)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER)
          );
      }
      await UserLocal.findOneAndUpdate(
        { email: Useremail },
        { password: hashedPassword }
      );
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SUCCESS)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new UserController();
