const { BLOG_ROLE, PASSPORT } = require("../config/default");
const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const { SuccessResponse, ErrorResponse } = require("../helper/response");
const Admin = require("../models/Admin");
const Blog = require("../models/Blog");
const UserFacebook = require("../models/UserFacebook");
const UserGoogle = require("../models/UserGoogle");
const UserLocal = require("../models/UserLocal");
const moment = require("moment");
const { redirect } = require("../service/redirect");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
const FroalaEditor = require(path.join(
  appRoot.path,
  "/node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js"
));

class BlogController {
  async getBlogPage(req, res) {
    try {
      const foundBlog = await Blog.find({})
        .limit(2)
        .skip(0)
        .sort({ createdAt: -1 })
        .exec();
      res
        .status(STATUS.SUCCESS)
        .render("blog", { user: req.user, blogs: foundBlog, moment });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getBlogInfinite(req, res) {
    try {
      const foundBlog = await Blog.find({}).limit(2).skip(0).exec();
      res
        .status(STATUS.SUCCESS)
        .render("blog", { user: req.user, blogs: foundBlog });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getInfoBlogCreate(req, res) {
    try {
      res.status(STATUS.SUCCESS).render("admin/blog/submitInfo", {
        admin: req.user,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async getContentBlogCreate(req, res) {
    const { type, slug } = req.params;
    if (!type || !slug) {
      redirect(req, res, STATUS.BAD_REQUEST);
    }
    try {
      const foundBlog = await Blog.findOne({ slug: slug });
      if (!foundBlog) {
        return res.status(STATUS.NOT_FOUND).render("admin/blog/submitInfo", {
          admin: req.user,
        });
      }
      res.status(STATUS.SUCCESS).render("admin/blog/submitContent", {
        admin: req.user,
        blog: foundBlog,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async getBlogDashboard(req, res) {
    try {
      const blogs = await Blog.find({});
      return res
        .status(STATUS.SUCCESS)
        .render("admin/blog/blogDashboard", { admin: req.user, blogs });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async submitInfoBlog(req, res) {
    const { title, desc, author, type, keywordArray, source, link, image } =
      req.body;
    if (
      !title ||
      !desc ||
      !author ||
      !type ||
      keywordArray.length === 0 ||
      !source ||
      !image
    ) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      const newBlog = new Blog({
        title,
        desc,
        type,
        author,
        cover: image,
        keywords: keywordArray,
        source,
        link,
        writtenBy: req.user._id,
        content: null,
      });
      const createdBlog = await newBlog.save();
      return res.status(STATUS.CREATED).json(
        new SuccessResponse(MESSAGE.CREATE_SUCCESS, {
          createdBlog,
          url: `/management/content/blog/write-blog/submit-content/${createdBlog.type}/${createdBlog.slug}`,
        })
      );
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async submitContentBlog(req, res) {
    const { slug, content } = req.body;
    if (!slug || !content) {
      console.log({ slug, content });
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      await Blog.findOneAndUpdate({ slug: slug }, { content: content });
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async streamBlogImage(req, res) {
    const { type, slug } = req.params;

    fs.mkdir(
      path.join(appRoot.path, `/src/public/blog/${type}/${slug}/`),
      { recursive: true },
      (err) => {
        if (err) {
          return console.error(err);
        }
        FroalaEditor.Image.upload(
          req,
          `/public/blog/${type}/${slug}/`,
          function (err, data) {
            if (err) {
              console.log(err);
              return res.send(JSON.stringify(err));
            }
            res.send(data);
          }
        );
      }
    );
  }

  async deleteBlogImage(req, res) {
    fs.unlink(
      path.join(appRoot.path + "/src/", req.body.path),
      function (error) {
        if (error) {
          console.log(error);
          return res
            .status(STATUS.SERVER_ERROR)
            .json(
              new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER)
            );
        }
        // if no error, file has been deleted successfully
        return res
          .status(STATUS.SUCCESS)
          .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
      }
    );
  }
  async getWritor(req, res) {
    const { role, writerId, passport } = req.params;
    if (!role || !writerId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      let foundWriter = null;
      if (role === BLOG_ROLE.ADMIN.CODE) {
        foundWriter = await Admin.findById(writerId);
      } else if (role === BLOG_ROLE.MEMBER.CODE) {
        if (passport === PASSPORT.LOCAL) {
          foundWriter = await UserLocal.findById(writerId);
        } else if (passport === PASSPORT.GOOGLE) {
          foundWriter = await UserGoogle.findById(writerId);
        } else if (passport === PASSPORT.FACEBOOK) {
          foundWriter = await UserFacebook.findById(writerId);
        }
      }
      // const blogs = await Blog.find({});
      res.status(STATUS.SUCCESS).json({
        writer: foundWriter,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getBlogList(req, res) {
    try {
      const blogs = await Blog.find({});
      res.status(STATUS.SUCCESS).json({
        rows: blogs,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}
module.exports = new BlogController();
