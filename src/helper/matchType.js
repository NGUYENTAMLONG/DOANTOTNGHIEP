function matchType(type) {
  //   const array = [
  //     "action",
  //     "adventure",
  //     "wits",
  //     "humor",
  //     "martial-arts",
  //     "detective",
  //     "horror",
  //     "color-manga",
  //     "comic",
  //     "ecchi",
  //     "fantasy",
  //     "demon",
  //     "drama",
  //     "romantic",
  //     "sword-and-magic",
  //     "16+",
  //     "18+",
  //   ];
  let arrayType = [];
  switch (type) {
    case "action":
      arrayType = ["Hành động", "Action", "action"];
      break;
    case "adventure":
      arrayType = ["Phưu lưu", "Adventure"];
      break;
    case "wits":
      arrayType = ["Đấu trí", "wits"];
      break;
    case "humor":
      arrayType = ["Hài hước", "Vui nhộn"];
      break;
    case "martial-arts":
      arrayType = ["Võ thuật", "Kungfu"];
      break;
    case "detective":
      arrayType = ["Thám tử", "Trinh thám", "Phá án", "Suy luận"];
      break;
    case "horror":
      arrayType = ["Kinh dị"];
      break;
    case "color-manga":
      arrayType = ["Màu"];
      break;
    case "comic":
      arrayType = ["comic", "Truyện tranh Mỹ"];
      break;
    case "ecchi":
      arrayType = ["ecchi"];
      break;
    case "fantasy":
      arrayType = ["Giả tưởng"];
      break;
    case "demon":
      arrayType = ["Ác quỷ", "Quỷ dữ"];
      break;
    case "drama":
      arrayType = ["Kịch", "Drama"];
      break;
    case "romantic":
      arrayType = ["romantic", "Lãng mạn"];
      break;
    case "sword-and-magic":
      arrayType = ["Kiếm và phép thuật", "SAM"];
      break;
    case "16+":
      arrayType = ["16+"];
      break;
    case "18+":
      arrayType = ["18+"];
      break;
    default:
      break;
  }
  return arrayType;
}
module.exports = matchType;
