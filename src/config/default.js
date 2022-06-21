module.exports.VALUES = {
  IS_SUCCESS: true,
  IS_FAILURE: false,
  LIKES: 0,
  COMPLETE_STATUS: "Hoàn thành",
  TOKEN_SECRET: "manga",
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
  EMAIL: "tamlong12032000@gmail.com",
  PASSWORD: "uqoukvtmwpcjllzf",
  SERVICE: "gmail",
};

module.exports.SECRET_KEY = "tamlongdev";
