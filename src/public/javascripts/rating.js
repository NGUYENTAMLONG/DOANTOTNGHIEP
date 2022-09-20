function rate(value) {
  clearRates();
  addRates(value);
}

//- Remove Active
function clearRates() {
  for (var i = 1; i <= 5; i++) {
    document.getElementById("star" + i).classList.remove("active");
  }
}

//- Add Active
function addRates(value) {
  for (var i = 1; i <= value; i++) {
    document.getElementById("star" + i).classList.add("active");
  }
}
// CLEAR STARS
window.addEventListener("click", function (click) {
  if (!document.getElementById("rate").contains(click.target)) {
    clearRates();
  }
});

// *******************************************

function rating(mangaId) {
  const counterStar = document.querySelectorAll(".stars .active").length;
  // console.log(mangaId, counterStar);
  const data = {
    mangaId: mangaId,
    counterStar,
  };

  fetch("/user/rate", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.isSuccess === true) {
        swal({
          title: "Thành công",
          text: "Cảm ơn bạn đã đánh giá tác phẩm manga này",
          icon: "success",
          button: "OK!",
        }).then(() => {
          location.reload();
        });
      } else if (
        !result.isSuccess &&
        result.errorCode === "BAD_REQUEST" &&
        result.message === "ALREADY REATED"
      ) {
        swal({
          title: "Thông báo",
          text: "Bạn đã đánh giá bộ truyện này rồi",
          icon: "warning",
          button: "OK!",
        }).then(() => {
          location.reload();
        });
      } else if (
        !result.isSuccess &&
        result.errorCode === "UNAUTHORIZED" &&
        result.message === "UNAUTHORIZED"
      ) {
        swal({
          title: "Thông báo !",
          text: "Bạn phải đăng nhập trước :>",
          icon: "error",
          button: "OK!",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function ratingBlog(blogId) {
  const counterStar = document.querySelectorAll(".stars .active").length;
  // console.log(blogId, counterStar);
  const data = {
    blogId: blogId,
    counterStar,
  };

  fetch("/user/blog/api/rate", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.isSuccess === true) {
        swal({
          title: "Thành công",
          text: "Cảm ơn bạn đã đánh giá bài viết này",
          icon: "success",
          button: "OK!",
        }).then(() => {
          location.reload();
        });
      } else if (
        !result.isSuccess &&
        result.errorCode === "ALREADY_EXISTS" &&
        result.message === "ALREADY REATED"
      ) {
        swal({
          title: "Thông báo",
          text: "Bạn đã đánh giá bài viết này rồi",
          icon: "warning",
          button: "OK!",
        }).then(() => {
          location.reload();
        });
      } else if (
        !result.isSuccess &&
        result.errorCode === "UNAUTHORIZED" &&
        result.message === "UNAUTHORIZED"
      ) {
        swal({
          title: "Thông báo !",
          text: "Bạn phải đăng nhập trước :>",
          icon: "error",
          button: "OK!",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
