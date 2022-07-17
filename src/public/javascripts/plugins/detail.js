//Show more & show less Description
const btnShowMore = document.querySelector(".show-more");
const textDesc = document.querySelector(".manga-info__desc p");

let flag = false;
btnShowMore.onclick = function () {
  if (flag === false) {
    btnShowMore.innerHTML = "Show Less <i class='fas fa-angle-up'></i>";
    textDesc.classList.remove("truncate");
    flag = true;
  } else {
    btnShowMore.innerHTML = "Show More <i class='fas fa-angle-down'></i>";
    textDesc.classList.add("truncate");
    flag = false;
  }
};

//Searching Chapter by Filter
$(document).ready(function () {
  $("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

// Tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

//Follow
function handleFollow(mangaId) {
  const checkedFollow = document.getElementById("checkFollow").checked;
  const followBtn = document.querySelector(".follow");
  if (checkedFollow) {
    followBtn.querySelector(
      "span"
    ).innerHTML = `<i class="fas fa-heart-broken"></i> Bỏ theo dõi`;
    addFollow(mangaId);
  } else {
    followBtn.querySelector(
      "span"
    ).innerHTML = ` <i class="fas fa-heartbeat"></i> Theo dõi`;
    unFollow(mangaId);
  }
}

function addFollow(mangaId) {
  const payload = {
    mangaId: mangaId,
  };
  const headers = {
    "content-Type": "application/json",
  };
  fetch("/follow", {
    method: "POST",
    body: JSON.stringify(payload),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.isSuccess === true) {
        swal({
          title: "Đang theo dõi",
          text: "Nhớ dõi theo hàng tuần nha !",
          icon: "success",
          button: "OK!",
        });
      } else {
        swal({
          title: "Có lỗi rồi !",
          text: result.message,
          icon: "error",
          button: "OK!",
        });
      }
    })
    .catch((error) => console.log(error));
}

function unFollow(mangaId) {
  const payload = {
    mangaId: mangaId,
  };
  const headers = {
    "content-Type": "application/json",
  };
  fetch("/follow", {
    method: "DELETE",
    body: JSON.stringify(payload),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.isSuccess === true) {
        swal({
          title: "Đã bỏ theo dõi",
          text: "Cảm ơn bạn đã ủng hộ !",
          icon: "success",
          button: "OK!",
        });
      } else {
        swal({
          title: "Có lỗi rồi !",
          text: result.message,
          icon: "error",
          button: "OK!",
        });
      }
    })
    .catch((error) => console.log(error));
}
