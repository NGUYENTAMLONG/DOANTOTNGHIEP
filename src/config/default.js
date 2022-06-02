module.exports.VALUES = {
  IS_SUCCESS: true,
  IS_FAILURE: false,
  LIKES: 0,
};

module.exports.OPTION_COOKIE = { maxAge: 900000, httpOnly: true };
module.exports.ROLES = {
  CONTENT_ADMIN: {
    CODE: "CA",
    DESC: "The site's content administrator (manga, blog, comment,...)/ quản trị viên nội dung của trang web (truyện tranh, bài viết blog, bình luận,...)",
  },
  HR_ADMIN: {
    CODE: "HRA",
    DESC: "the site's user administrator(user account, admin account,...)/ quản trị viên người dùng của trang web (tài khoản người dùng,tài khoản quản trị viên...)",
  },
  MEMBER: {
    CODE: "M",
    DESC: "Member of manga community/ Thành viên của công đồng page Manga",
  },
};

module.exports.ADMIN_EMAIL = {
  EMAIL: "hien18101966@gmail.com",
  PASSWORD: "18101966",
  SERVICE: "email",
};

module.exports.SECRET_KEY = "tamlongdev";
