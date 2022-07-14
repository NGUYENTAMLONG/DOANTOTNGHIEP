// Khai báo thư viện *******************************************
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const morgan = require("morgan");
const database = require("./config/database");
const route = require("./routers/index.routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// Khởi tạo server *******************************************
const app = express();
// const process = require("process");
//********************* Khởi tạo cổng server
const PORT = process.env.PORT || 3416;
app.listen(PORT, () => {
  console.log(`🐲🐲🐲 Server is running on PORT: ${PORT} !!! 🍀🍀🍀`);
});

app.use(cors()); // Cho phép chia sẻ api với localhost khác
//********************* HTTP logger
//app.use(morgan("combined")); //thu vien morgan dung de log ra http request tu client -> server
//********************* HTTP logger
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
//************************ Config Froala
const appRootPath = require("app-root-path");
app.use(
  "/froalacss",
  express.static(
    path.join(
      appRootPath.path,
      "/node_modules/froala-editor/css/froala_editor.pkgd.min.css"
    )
  )
);

app.use(
  "/froalajs",
  express.static(
    path.join(
      appRootPath.path,
      "/node_modules/froala-editor/js/froala_editor.pkgd.min.js"
    )
  )
);
app.use(
  "/deleteImage",
  express.static(
    path.join(
      appRootPath.path,
      "/node_modules/froala-editor/js/plugins/image.min.js"
    )
  )
);
//********************* config imagesPath (public path)
app.use("/public", express.static(__dirname + "/public"));
app.use("/image", express.static(path.join(__dirname, "public/images")));
app.use("/css", express.static(path.join(__dirname, "public/styles")));
app.use("/js", express.static(path.join(__dirname, "public/javascripts")));

app.use(express.static("public"));

//********************* Config template ejs
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
// //******************** Auth0 ******************* */
// const { auth } = require("express-openid-connect");
// const config = {
//   // authRequired: false,
//   // auth0Logout: true,
//   // secret: process.env.SECRET,
//   // baseURL: process.env.BASEURL,
//   // clientID: process.env.BASEURL,
//   // issuerBaseURL: process.env.ISSUER,

//   authRequired: false,
//   auth0Logout: true,
//   secret:
//     "oiumtsxnjpdbhkkwjueehzxebvtjjlgzierahwwjqrnuqyqyrsuzpuwffgizpegawtdzdbvkynrpbjipzxfcnnbyrdkdxzir",
//   baseURL: "http://localhost:3416",
//   clientID: "Dd0kzG9dTjvL52nTAwKgv7d7QDJJO8l6",
//   issuerBaseURL: "https://dev-m7l5oz18.us.auth0.com",
// };

// // auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config));

// // req.isAuthenticated is provided from the auth router

// app.get("/testAuth", (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
// });
// const { requiresAuth } = require("express-openid-connect");

// app.get("/profile", requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });

//***************************************** */

//********************* Connect to Database (MongoDB) - Kết nối tới cơ sở dữ liệu MONGODB

database.connect();

// ******************** Cofig CookieParser
app.use(cookieParser());

//********************* Config router app
route.adminRoute(app); // For Admin
route.userRoute(app); // For User

// const MangaModel = require("./models/Manga");
const Manga = require("./models/Manga");
const Chapter = require("./models/Chapter");
// const Slide = require("./models/Slide");
// MangaModel.deleteOne({ name: "Clover" })
//   .then(() => {
//     console.log("deleted");
//   })
//   .catch((error) => console.log(error));

// MangaModel.create({
//   name: "Dragon Ball",
//   anotherName: "Bảy viên ngọc rồng",
//   image: "https://cdn-amz.fadoglobal.io/images/I/81S8xoiksVL.jpg", // updating...(ex: require)
//   author: "Toriyama Akira",
//   type: ["Action", "Phưu lưu", "Chiến dịch", "Kỳ ảo", "16+"],
//   serve: "all",
//   description:
//     "Một cậu bé có đuôi khỉ được tìm thấy bởi một ông lão sống một mình trong rừng, ông đặt tên là Son Goku và xem đứa bé như là cháu của mình. Một ngày nọ Goku tình cờ gặp một cô gái tên là Bulma trên đường đi bắt cá về, Goku và Bulma đã cùng nhau truy tìm bảy viên ngọc rồng. Các viên ngọc rồng này chứa đựng một bí mật có thể triệu hồi một con rồng và ban điều ước cho ai sở hữu chúng. Trên cuộc hành trình dài đi tìm những viên ngọc rồng, họ gặp những người bạn (Yamcha, Krillin,Yajirobe, Thiên, Giáo tử, Oolong,...) và những đấu sĩ huyền thoại cũng như nhiều ác quỷ. Họ trải qua những khó khăn và học hỏi các chiêu thức võ thuật đặc biệt để tham gia thi đấu trong đại hội võ thuật thế giới được tổ chức hằng năm. Ngoài các sự kiện đại hội võ thuật, Goku và các bạn còn phải đối phó với các thế lực độc ác như Đại vương Pilaf, Quân đoàn khăn đỏ của Độc nhãn tướng quân, Đại ma vương Picollo và những đứa con của hắn. Chiến binh người Saiya: Radiz, Hoàng tử Saiya Vegeta cùng tên cận vệ Nappa. Rồi họ đi đến Namek, gặp rồng thần của Namek; chạm trán Frieza, khi trở về Trái Đất đụng độ Nhóm android sát thủ (các Android 16, 17, 18,19, 20) và sau đó là quái vật từ tương lai Cell, Kẻ thù từ vũ trụ Majin Buu, thần hủy diệt Beerus, các đối thủ từ các vũ trụ song song, Đối thủ mạnh nhất với Goku là Jiren (đến từ vũ trụ 11)",
//   status: "Đang tiến hành",
//   hot: true,
//   statistical: { likes: 2200, hearts: 5411, comments: 1210, views: 1230000 }, // updating...(ex: require)
//   contentId: "62b94f45e599a225e0a674a0", // updating... (ex: require)
//   fanmade: false,
// })
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));

/****** populate */
// async function getSlides() {
//   console.log("fuck");
//   try {
//     const slides = await Slide.find({
//       _id: "6205eb72be1da090e957979f",
//     }).populate("manga");
//     if (!slides) {
//       console.log("Something went wrong !!!");
//     }
//     console.log(slides);
//   } catch (err) {
//     console.error(err);
//   }
// }
// getSlides();
// const Manga = require("./models/Manga");
// Manga.remove()
//   .then(() => console.log("success remove"))
//   .catch((error) => console.log(error));

// async function createSlide() {
//   const slide = new Slide({
//     image: "/image/s2.jpg",
//     manga: "6222dbd6ed536dbd287df495",
//   });
//   try {
//     const createdSlide = await slide.save();
//     if (!createdSlide) {
//       res.json(error);
//     }
//     console.log({ status: "ok", createdSlide: createdSlide });
//   } catch (error) {
//     console.log(error);
//   }
// }
// // createSlide();

const array = [
  {
    name: "Naruto",
    anotherName: "Naruto Shippuden, Uzumaki Naruto",
    image: "/image/naruto.jpg", // updating...(ex: require)
    author: "Kishimoto Masashi",
    type: ["Action", "Phưu lưu", "Drama", "Chiến dịch", "16+", "Ninja"],
    serve: "all",
    description:
      "Truyện lấy bối cảnh bắt nguồn từ sự việc xảy ra vào mười hai năm trước, con Hồ Ly Chín Đuôi (Kyuubi-Kurama[1]) đã tấn công Làng Lá (木ノ葉隠れ (Mộc Diệp Ẩn Lý) Konohagakure / Konohagakure no Sato?). Với lượng sức mạnh khổng lồ, nó có thể dễ dàng khiến sóng thần nổi dậy và san bằng núi non chỉ với một trong số chín cái đuôi, nó đã gây ra sự hỗn loạn tột cùng và giết chết nhiều người, cho tới khi người lãnh đạo của làng Lá – ngài Hokage Đệ Tứ (Namikaze Minato) đã hi sinh để phong ấn con quái thú vào cơ thể con trai mình - Naruto khi cậu chỉ vừa mới được sinh ra, bằng cấm thuật: Kin Jutsu Ogi! 'Shiki Fuin' (Thi Quỷ Phong Tận - một thuật cấm phải đánh đổi bằng tính mạng). Hokage Đệ Tứ, người được vinh danh vì đã phong ấn con yêu hồ, khi nhắm mắt xuôi tay đã mong muốn Naruto được người dân tôn trọng khi có thân xác là nơi chứa đựng con quái vật....",
    status: "Hoàn thành",
    hot: true,

    fanmade: false,
  },
  {
    name: "Kimetsu no Yaiba",
    anotherName: "Thanh gươm diệt quỷ, Demon slayer",
    image: "/image/demonslayer.jpg", // updating...(ex: require)
    author: "Gotouge Koyoharu",
    type: [
      "Action",
      "Phưu lưu",
      "Chiến dịch",
      "Kỳ ảo",
      "Kiếm và phép thuật",
      "Kinh dị",
      "18+",
    ],
    serve: "all",
    description:
      "Thời kỳ Đại Chính, có nhiều tin đồn về việc loài quỷ ăn thịt người đang ẩn nấp trong rừng. Vì thế, người dân trong những làng bên cạnh không bao giờ dám ra ngoài vào ban đêm. Nhân vật chính - Kamado Tanjiro là một cậu bé tốt bụng, thông minh sống cùng với gia đình trên núi và kiếm tiền bằng cách bán than củi. Tất cả mọi thứ đã thay đổi kể từ khi gia đình cậu bị quỷ tấn công, mẹ cùng bốn người em bị giết hại. Tanjiro và em gái cả của cậu, Nezuko là những người duy nhất còn sống sót sau vụ việc đó, cô bé giờ đã bị biến thành quỷ nhưng ngạc nhiên là vẫn còn những cảm xúc và suy nghĩ của con người. Tanjiro quyết định tham gia Sát Quỷ Đội sau khi được Thủy trụ Tomioka Giyuu giới thiệu cho cựu Thủy Trụ Urokodaki Sakonji để huấn luyện cậu trở thành một kiếm sĩ diệt quỷ nhằm giúp em gái cậu trở lại thành người, đồng thời trả thù cho sự mất mát của gia đình cậu.",
    status: "Hoàn thành",
    hot: true,

    fanmade: false,
  },
  {
    name: "Fairy Tail",
    anotherName: "Hội pháp sư",
    image: "/image/fairytail.jpg", // updating...(ex: require)
    author: "Mashima Hiro",
    type: [
      "Action",
      "Phưu lưu",
      "Chiến dịch",
      "Kỳ ảo",
      "16+",
      "Kiếm và phép thuật",
      "Magic",
    ],
    serve: "all",
    description:
      "Câu chuyện mở đâu khi Lucy Heartfilia, một Tinh Linh ma đạo sĩ quyến rũ 17 tuổi, từ bỏ gia đình giàu có của mình để đi gia nhập Fairy Tail, một hội pháp sư rất mạnh ở Fiore, luôn nổi tiếng với việc phá hoại tài sản khi họ làm nhiệm vụ và gây nhiều rắc rối khiến Hội đồng ma thuật phải đau đầu. Trên đường đi, cô gặp gỡ Natsu Dragneel ma đạo sĩ của hội Fairy Tail cùng Happy, một chú mèo biết bay. Họ đang đi tìm cha nuôi của Natsu là một con rồng có tên Igneel đã biến mất bảy năm trước đó. Lucy chẳng may bị lừa bởi một ma đạo sĩ giả danh Salamander (Hỏa Long) đã từng là một thành viên trong hội Titan Nose. Natsu đã giải cứu Lucy, tiết lộ mình là Salamander thực sự và là một Dragon Slayer (Sát long ma đạo sĩ),cậu ma đạo sĩ có sức mạnh của 1 Hỏa Long. Sau khi đánh bại kẻ giả mạo, Natsu mời Lucy gia nhập Fairy Tail và bắt đầu chuyến du ngoạn cùng Natsu từ đây, có vẻ Lucy và Natsu sẽ yêu nhau trong một ngày không xa...",
    status: "Đang tiến hành",
    hot: true,

    fanmade: false,
  },
  {
    name: "Gintama",
    anotherName: "Linh hồn bạc",
    image: "/image/gintama.jpg", // updating...(ex: require)
    author: "Sorachi Hideaki",
    type: ["Action", "Phưu lưu", "Hài hước", "Vui nhộn", "16+"],
    serve: "all",
    description:
      "Gintama là câu chuyện diễn ra ở Edo (được đổi tên thành Tokyo từ năm 1868), Nhật Bản, vào cuối thời Edo khi nơi này đang bị xâm lược bởi bọn người ngoài hành tinh được gọi chung là Amanto (天人あまんと (Thiên Nhân)?). Các samurai Nhật Bản đã chiến đấu chống lại Amanto nhưng thất bại, và Amanto ra lệnh cấm mang gươm ở nơi công cộng. Cốt truyện tập trung vào một samurai lập dị tên là Sakata Gintoki, người đã giúp chàng trai trẻ Shimura Shinpachi cứu chị gái cậu ta từ một nhóm người ngoài hành tinh muốn đưa cô vào kỹ viện. Bị ấn tượng bởi Gintoki, Shinpachi đã quyết định đi theo Gintoki để 'học cách trở thành một samurai' và làm các công việc tự do cùng với anh ta để có thể trả tiền thuê nhà hàng tháng. Hai người bọn họ đã cứu một cô bé người ngoài hành tinh Yato tên là Kagura khỏi một nhóm Yakuza, những kẻ muốn lợi dụng sức mạnh siêu phàm của cô bé để giết người. Kagura đã nhập nhóm cùng Shinpachi và Gintoki, lập nên Vạn Sự Ốc Gin-chan (万事屋よろずや銀ぎんちゃん Yorozuya Gin-chan?). Trong khi thực hiện những công việc được thuê, họ đã đụng độ lực lượng cảnh sát Shinsengumi vài lần. Shinsengumi và họ đôi khi liên kết với nhau khi phải chống lại những tên tội phạm đặc biệt nguy hiểm. Họ cũng đã gặp gỡ nhưng đồng bọn cũ của Gintoki trong cuộc chiến chống lại Amanto trước đây, bao gồm chuyên gia khủng bố Katsura Kotarō – người vẫn giữ mối quan hệ bạn bè với họ cho dù tham vọng của anh ta là lật đổ chế độ Mạc Phủ, hay Takasugi Shinsuke – người đóng vai trò đối kháng trong suốt câu chuyện, muốn lật đổ Mạc Phủ bằng những cách thức tàn ác hơn so với Katsura...",
    status: "Đang tiến hành",
    hot: false,
    fanmade: false,
  },
  {
    name: "Conan",
    anotherName: "Thám tử lừng danh Conan, Meitantei Conan,Detective Conan",
    image: "/image/conan.jpg", // updating...(ex: require)
    author: "Aoyama Gōshō",
    type: ["Action", "Trinh thám", "Đấu trí", "18+"],
    serve: "all",
    description:
      "Kudo Shinichi, 17 tuổi, là một thám tử học sinh trung học phổ thông rất nổi tiếng, thường xuyên giúp cảnh sát phá các vụ án khó khăn.Trong một lần khi đang theo dõi một vụ tống tiền, cậu đã bị thành viên của Tổ chức Áo đen bí ẩn phát hiện. Chúng đánh gục Shinichi, làm cậu bất tỉnh và ép cậu uống loại thuốc độc APTX-4869 mà Tổ chức vừa điều chế nhằm bịt đầu mối. Tuy vậy, thứ thuốc ấy không giết chết cậu mà lại gây ra tác dụng phụ khiến cậu teo nhỏ thành một đứa trẻ khoảng 6 tuổi Sau đó, cậu tự xưng là Edogawa Conan và được Mori Ran - cô bạn thân thời thơ ấu của cậu khi còn là Kudo Shinichi - nhận nuôi và mang về văn phòng thám tử của bố cô là Mori Kogoro. Xuyên suốt series, Conan đã âm thầm hỗ trợ ông Mori phá các vụ án. Đồng thời cậu cũng phải nhập học lớp 1 Tiểu học, nhờ đó mà kết thân với nhiều người và lập ra Đội thám tử nhí khám phá và cạch trần nhiều tội ác,...",
    status: "Đang tiến hành",
    hot: true,
    fanmade: false,
  },
];
// Chapter.create({});
// Manga.create(array)
//   .then(function (docs) {
//     console.log(docs);
//   })
//   .catch(function (err) {
//     console.log(err);
//   });
