module.exports.VALUES = {
  IS_SUCCESS: true,
  IS_FAILURE: false,
  LIKES: 0,
  COMPLETE_STATUS: "Hoàn thành",
  TOKEN_SECRET: "manga",
  SESSION_SECRET: "manga",
};

module.exports.OPTION_COOKIE = { maxAge: 900000, httpOnly: true };
module.exports.PASSPORT = {
  LOCAL: "LOCAL",
  GOOGLE: "GOOGLE",
  FACEBOOK: "FACEBOOK",
};
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
module.exports.types = [
  {
    name: "Action",
    description:
      "Thể loại này thường có nội dung về đánh nhau, bạo lực, hỗn loạn, với diễn biến nhanh",
  },
  {
    name: "Phiêu lưu",
    description:
      "Thể loại phiêu lưu, mạo hiểm, thường là hành trình của các nhân vật nhằm thực hiện một mục đích nào đó mang ý nghĩa của cả câu truyện.",
  },
  {
    name: "Adult",
    description:
      "Thể loại mang nhiều yếu tố người lớn phù hợp với lứa tuổi trên 18,... Bạn đọc nên cân nhắc trước khi xem.",
  },
  {
    name: "Magic",
    description:
      "Thể loại giả tưởng có tồn tại những sức mạnh siêu nhiên như thần chú, gây phép, vòng tròn ma thuật...",
  },
  {
    name: "Kỳ ảo",
    description:
      "Truyện có yếu tố phép thuật, kỳ ảo… được đặt trong bối cảnh siêu tưởng (tiên giới, ma giới…",
  },
  {
    name: "Ninja",
    description:
      "Truyện có yếu tố liên quan đến Ninja hay Nhẫn giả hoặc Shinobi là danh xưng để chỉ những cá nhân hay tổ chức gián điệp hoặc lính đánh thuê chuyên về hoạt động bí mật dưới thời phong kiến Nhật Bản về nghệ thuật không chính thống của chiến tranh từ thời kỳ Kamakura đến thời kỳ Edo.",
  },
  {
    name: "Đấu trí",
    description:
      "Truyện có yếu tố liên quan đến tư duy đặc trưng bởi các màn đấu tranh bằng trí tuệ của nhân vật như thám tử, triết gia, những người thông minh,...",
  },
  {
    name: "Truyện Scan",
    description:
      "Truyện đề cập đến Scanlation (hay còn gọi là scanslation hay mangascan) là từ đề cập đến quét ảnh, dịch và chỉnh sửa một truyện tranh (như manga hay manhwa) từ một ngôn ngữ này sang ngôn ngữ khác thực hiện bởi người hâm mộ, sau đó phân phối miễn phí trên Internet.",
  },
  {
    name: "Supernatural",
    description:
      "Thể hiện những sức mạnh đáng kinh ngạc và không thể giải thích được, chúng thường đi kèm với những sự kiện trái ngược hoặc thách thức với những định luật vật lý",
  },
  {
    name: "Chuyển sinh",
    description:
      "Thể loại này là những câu chuyện về người ở một thế giới này xuyên đến một thế giới khác, có thể là thế giới mang phong cách trung cổ với kiếm sĩ và ma thuật, hay thế giới trong game, hoặc có thể là bạn chết ở nơi này và được chuyển sinh đến nơi khác",
  },
  {
    name: "Chiến dịch",
    description:
      "Truyện thường đề cập tới một thế giới hay một chuỗi các sự kiện, một hành trình của một nhân vật hay một nhóm các nhân vật nhằm thực hiện một mục đích nào đó trong lâu dài hoặc nổi dậy trống lại một thế lực đối lập nào đó... truyện thường có nội dung trường kỳ dài tập...",
  },
  {
    name: "Trung cổ",
    description:
      "Truyện thường có nội dung xảy ra ở thời cổ đại phong kiến trung cổ với nhiều sự kiện lịch sử con người và có sự thêu dệt thêm thắt với các biến cố ngoài đời thực...",
  },
  {
    name: "Lãng mạn",
    description:
      "Truyện thuộc kiểu lãng mạn, kể về những sự kiện vui buồn trong tình yêu của nhân vật chính.",
  },
  {
    name: "Drama",
    description:
      "Thể loại mang đến cho người xem những cảm xúc khác nhau: buồn bã, căng thẳng thậm chí là bi phẫn",
  },
  {
    name: "Ngôn tình",
    description:
      "Truyện thuộc kiểu lãng mạn, kể về những sự kiện vui buồn trong tình yêu của nhân vật chính mang nhiều tình tiết ngọt ngào trong đời sống.",
  },
  {
    name: "Trinh thám",
    description:
      "Truyện trinh thám, thể loại văn học phổ biến trong đó giới thiệu và điều tra tội phạm và thủ phạm được tiết lộ... mở ra một thế giới ly kỳ hấp dẫn bám sát với cuộc điều tra thường là của nhân vật chính.",
  },
  {
    name: "School Life",
    description:
      "Trong thể loại này, ngữ cảnh diễn biến câu chuyện chủ yếu ở trường học",
  },
  {
    name: "Webtoon",
    description:
      "Là truyện tranh được đăng dài kỳ trên internet của Hàn Quốc chứ không xuất bản theo cách thông thường",
  },
  {
    name: "Hài kịch",
    description:
      "Là truyện tranh có sự xuất hiện của các nhân vật có tính cách hài hước và thường có những pha trò cười trong những tình huống dở khóc dở cười dành cho khán giả.",
  },
  {
    name: "Chuyển thể",
    description:
      "Là truyện tranh có yếu tố chuyển thể toàn bộ hoặc một phần của một tác phẩm nghệ thuật (tiểu thuyết,phim ảnh) hay một câu chuyện sang hình thức phim truyện tranh. Được thêm thắt một chút biến tấu cho câu chuyện mới mẻ hơn để lôi cuốn người đọc",
  },
  {
    name: "Slice Of Life",
    description:
      "Là truyện tranh có yếu tố nói về cuộc sống đời thường, mỗi quan hệ giữa các nhân vật và lấy đó làm trọng tâm, nội dung chính của truyện giúp người đọc đúc rút ra nhiều trải nghiệm, kinh nghiệm sống quý báu,...",
  },
  {
    name: "Sports",
    description:
      "Đúng như tên gọi, những môn thể thao như bóng đá, bóng chày, bóng chuyền, đua xe, cầu lông,... là một phần của thể loại này",
  },
  {
    name: "Mystery",
    description:
      "Thể loại thường xuất hiện những điều bí ấn không thể lí giải được và sau đó là những nỗ lực của nhân vật chính nhằm tìm ra câu trả lời thỏa đáng",
  },
  {
    name: "Psychological",
    description:
      "Thể loại liên quan đến những vấn đề về tâm lý của nhân vật ( tâm thần bất ổn, điên cuồng ...) thể hiện chiều sâu nội tâm nhân vật khiến người đọc càng tò mò và muốn làm sáng tỏ hiểu rõ bản chất con người cũng như sự việc diễn ra trong thể loại này",
  },
  {
    name: "Võ thuật",
    description:
      "Thể loại này mang hơi hướng võ thuật kungfu và những triết lý thâm sâu từ võ học thông qua hành trình của các nhân vật trong truyện, truyện đem đến cho người đọc những pha luyện võ hành động mũa võ hết sức sinh động đẹp mắt,...",
  },
  {
    name: "Truyện màu",
    description: "Tổng hợp truyện tranh màu, rõ, đẹp,...",
  },
  {
    name: "Tâm lí",
    description:
      "Thể loại này đem đến những tình huống mang nặng tính tâm lý diễn biến phức tạp trong nội tâm nhân vật,...",
  },
  {
    name: "Thiếu nhi",
    description:
      "Thể loại này phù hợp với các bạn đọc nhỏ tuổi thường có nội dung nhẹ nhàng dễ tiếp thu và mang nhiều điều tích cự cũng như ý nghĩa trong từng mẩu truyện, vừa giúp các bạn đọc giải trí và học hỏi từ tác phẩm,...",
  },
  {
    name: "Mecha",
    description:
      "Mecha là cách gọi của người Nhật thay cho “ mechanical”, chỉ những thứ thuộc về máy móc cơ khí, cơ học hoặc công nghệ, thường trong truyện mang yếu tố robot và thế giới tương lại hoặc giả tưởng...",
  },
  {
    name: "Horror",
    description:
      "Horror là: rùng rợn, nghe cái tên là bạn đã hiểu thể loại này có nội dung thế nào. Nó làm cho bạn kinh hãi, khiếp sợ, ghê tởm, run rẩy, có thể gây sock - một thể loại không dành cho người yếu tim",
  },
  {
    name: "Xuyên không",
    description:
      "Xuyên Không, Xuyên Việt là thể loại nhân vật chính vì một lý do nào đó mà bị đưa đến sinh sống ở một không gian hay một khoảng thời gian khác. Nhân vật chính có thể trực tiếp xuyên qua bằng thân xác mình hoặc sống lại bằng thân xác người khác.",
  },
  {
    name: "Mature",
    description:
      "Thể loại dành cho lứa tuổi 17+ bao gồm các pha bạo lực, máu me, chém giết, tình dục ở mức độ vừa",
  },
  {
    name: "Shounen",
    description:
      "Shounen (shonen/shōnen) là một từ tiếng Nhật và nó có ý nghĩa như từ “ thanh thiếu niên” ( tuổi từ 10 đến 18 tuổi). Từ này cũng dùng để chỉ thời niên thiếu, tuổi teen, tuổi trẻ",
  },
  {
    name: "Kinh dị - Đen tối",
    description:
      "Thể loại này mang nặng yếu tố kinh dị tăm tối những yếu tố hù dọa, giết chóc man rợ của các nhân vật trong truyện,... Các bạn đọc nên cân nhắc đến việc đọc các tác phẩm này",
  },
  {
    name: "Military",
    description:
      "Thể loại này mang các yếu tố về quân sự đặc trưng bởi các sĩ quan quân đội ,... các phương tiện quân sự trang bị vũ trang với cốt truyện liên quan,...",
  },
  {
    name: "Manhua",
    description:
      "Truyện tranh của Trung Quốc,  truyện mang sắc thái hay bản sắc văn hóa cuộc sống đặc trung của Trung Quốc",
  },
  {
    name: "Manwua",
    description:
      "Truyện tranh của Hàn Quốc, truyện mang sắc thái hay bản sắc văn hóa cuộc sống đặc trung của Hàn Quốc",
  },
  {
    name: "Demons - Monster",
    description:
      "Truyện tranh mang nhiều yếu tố kinh dị của các nhân vật quái thú ác quỷ xuất hiện trong tác phẩm",
  },
  {
    name: "Kiếm & Phép thuật",
    description:
      "Truyện tranh mang nhiều yếu tố kỳ ảo xuất hiện tựa như các tác phẩm hiệp sĩ pháp sư huyền huyễn phương Tây...",
  },
  {
    name: "Historical",
    description:
      "Truyện tranh mang nhiều yếu tố liên quan đến thời xa xưa, lịch sử ...",
  },
  {
    name: "Ecchi",
    description:
      "Truyện tranh mang nhiều yếu tố liên quan đến các yếu tố cảm xúc Thường có những tình huống nhạy cảm nhằm lôi cuốn người xem,...",
  },
  {
    name: "Doujinshi",
    description:
      "Thể loại truyện phóng tác do fan hay có thể cả những Mangaka khác với tác giả truyện gốc. Tác giả vẽ Doujinshi thường dựa trên những nhân vật gốc để viết ra những câu chuyện theo sở thích của mình,...",
  },
  {
    name: "Comic",
    description: "Truyện tranh Châu Âu và Châu Mĩ,...",
  },
  {
    name: "16+",
    description: "Truyện phù hợp với lứa tuổi 16+...",
  },
  {
    name: "18+",
    description: "Truyện phù hợp với lứa tuổi 18+...",
  },
];
module.exports.PAGING = {
  LIMIT: 3,
};
module.exports.SERVE = {
  MALE: "male",
  FEMALE: "female",
  ALL: "all",
};
module.exports.COUNTRY = {
  JP: "Nhật Bản",
  CN: "Trung Quốc",
  US: "Mỹ",
  KR: "Hàn Quốc",
};
module.exports.VIEW_TYPE = {
  MANGA: "MANGA",
  PAGE: "PAGE",
  BLOG: "BLOG",
  NOVEL: "NOVEL",
  FANMADE: "FANMADE",
};
module.exports.MANGA_STATUS = {
  FINISHED: "Hoàn thành",
  UNFINISHED: "Đang tiến hành",
};
module.exports.PENDING = {
  INFOMATION: "Đang cập nhật",
};
module.exports.PROLONGATION = 2;
module.exports.RANDOM_SIZE = 12;
module.exports.SECRET_KEY = "tamlongdev";
