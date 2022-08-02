//Show more & show less Description
const textDesc = document.querySelector(".manga-info__desc p");
const showMoreBtn = document.querySelector(".show-more");

let bool = false;
function showMore() {
  if (bool === false) {
    showMoreBtn.innerHTML = "Show Less <i class='fas fa-angle-up'></i>";
    textDesc.classList.remove("truncate");
    bool = true;
  } else {
    showMoreBtn.innerHTML = "Show More <i class='fas fa-angle-down'></i>";
    textDesc.classList.add("truncate");
    bool = false;
  }
}

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
  const followBtn = document.querySelector(".follow span");
  if (checkedFollow) {
    followBtn.innerHTML = `<i class="fas fa-heartbeat"></i> Đang theo dõi`;
    addFollow(mangaId);
  } else {
    followBtn.innerHTML = ` <i class="fas fa-heart"></i> Theo dõi`;
    unFollow(mangaId);
  }
}

function addFollow(mangaId) {
  const data = {
    mangaId: mangaId,
  };

  fetch("/follow", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.isSuccess === true) {
        swal({
          title: "Đã theo dõi",
          text: "Hãy theo dõi bộ này hàng tuần nhé <3",
          icon: "success",
          button: "OK!",
        });
      } else {
        document.getElementById("checkFollow").click();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
          title: "Thông báo !",
          text: "Bạn phải đăng nhập trước :>",
          icon: "error",
          button: "OK!",
        });
      }
    })
    .catch((error) => console.log(error));
}
//Like
function handleLike(mangaId) {
  const checkedLike = document.getElementById("checkLike").checked;
  const likeBtn = document.querySelector(".like span");
  if (checkedLike) {
    likeBtn.innerHTML = `<i class="fas fa-thumbs-up"></i> Đã thích`;
    like(mangaId);
  } else {
    likeBtn.innerHTML = `<i class="far fa-thumbs-up"></i> Thích`;
    unlike(mangaId);
  }
}

function like(mangaId) {
  const data = {
    mangaId: mangaId,
  };

  fetch("/user/like", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (!result.isSuccess) {
        document.getElementById("checkLike").click();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function unlike(mangaId) {
  const payload = {
    mangaId: mangaId,
  };
  const headers = {
    "content-Type": "application/json",
  };
  fetch("/user/unlike", {
    method: "DELETE",
    body: JSON.stringify(payload),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.isSuccess === true) {
        return;
      } else {
        swal({
          title: "Thông báo !",
          text: "Bạn phải đăng nhập trước :>",
          icon: "error",
          button: "OK!",
        });
      }
    })
    .catch((error) => console.log(error));
}
