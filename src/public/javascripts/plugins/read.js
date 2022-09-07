(function () {
  // DON'T EDIT BELOW THIS LINE
  var d = document,
    s = d.createElement("script");
  s.src = "https://my-site-zlkjtgow8a.disqus.com/embed.js";
  s.setAttribute("data-timestamp", +new Date());
  (d.head || d.body).appendChild(s);
})();

if (localStorage.getItem("light") !== "on") {
  document.querySelector("#checkboxLight").checked = false;
  document.querySelector(".lightbulb-status").innerHTML = `Bật đèn`;
} else {
  toggleClass();
  document.querySelector("#checkboxLight").checked = true;
  document.querySelector(".lightbulb-status").innerHTML = `Tắt đèn`;
}

function toggleDarkmode(it) {
  if (localStorage.getItem("light") !== "on") {
    localStorage.setItem("light", "on");
    console.log(localStorage.getItem("light"));
    document.querySelector(".lightbulb-status").innerHTML = `Tắt đèn`;
    toggleClass();
  } else {
    localStorage.setItem("light", "off");
    console.log(localStorage.getItem("light"));
    document.querySelector(".lightbulb-status").innerHTML = `Bật đèn`;
    toggleClass();
  }
}

function toggleClass() {
  document.querySelector("body").classList.toggle("toggle__light-background");
  document
    .querySelectorAll(".darkmode")[0]
    .classList.toggle("toggle__light-text");
  document
    .querySelectorAll(".darkmode")[1]
    .classList.toggle("toggle__light-text");
}

function toTop() {
  window.scrollTo(0, 0);
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