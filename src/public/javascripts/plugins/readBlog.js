$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

function shareSocial() {
  return `
<div class="fb-like" data-href="${window.location.href}" data-width="" data-layout="standard" data-action="like" data-size="small" data-share="true"></div>`;
}
document.querySelector("#btn-share").innerHTML = shareSocial();
(function () {
  // DON'T EDIT BELOW THIS LINE
  var d = document,
    s = d.createElement("script");
  s.src = "https://my-site-zlkjtgow8a.disqus.com/embed.js";
  s.setAttribute("data-timestamp", +new Date());
  (d.head || d.body).appendChild(s);
})();
document.getElementById(
  "count-comment"
).innerHTML = `<span class="disqus-comment-count" data-disqus-url="${window.location.href}"><i class="fa fa-spinner fa-spin"></i></span>`;
const blogId = document
  .querySelector(".blog__statistical")
  .getAttribute("data-id");
const likeSpan = document.getElementById("span-like");

fetch("/user/blog/api/check-liked/" + blogId)
  .then((res) => res.json())
  .then((result) => {
    const counterLike = likeSpan.getAttribute("data-counter");
    if (!result.isSuccess) {
      likeSpan.innerHTML = `<span data-toggle="tooltip" class="mr-3" data-placement="bottom" title="Số lượt thích" onclick="likeBlog('${blogId}')" id="like-blog-btn">
        <i class="far fa-thumbs-up"></i> ${counterLike}
      </span>`;
    } else {
      const checkLiked = result.data;
      if (!checkLiked.liked) {
        likeSpan.innerHTML = `<span data-toggle="tooltip" class="mr-3" data-placement="bottom" title="Số lượt thích" onclick="likeBlog('${blogId}')" id="like-blog-btn">
        <i class="far fa-thumbs-up"></i> ${counterLike}
          </span>`;
      } else {
        likeSpan.innerHTML = `<span data-toggle="tooltip" class="mr-3" data-placement="bottom" title="Số lượt thích" onclick="unlikeBlog('${blogId}')" id="like-blog-btn">
          <i class="fas fa-thumbs-up"></i> ${counterLike}
        </span>`;
      }
    }
  })
  .catch((error) => console.log(error));

function likeBlog(blogId) {
  const data = {
    blogId: blogId,
  };
  fetch("/user/blog/api/like", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (!result.isSuccess && result.errorCode === "UNAUTHORIZED") {
        swal({
          title: "Error",
          text: "Hãy đăng nhập để thực hiện hành động này nhé :>",
          icon: "error",
          button: "OK!",
        });
      } else {
        const counterLike = result.data.counterLike;
        likeSpan.innerHTML = `<span data-toggle="tooltip" class="mr-3" data-placement="bottom" title="Số lượt thích" onclick="unlikeBlog('${blogId}')" id="like-blog-btn">
            <i class="fas fa-thumbs-up"></i> ${counterLike + 1}
            </span>`;
        likeSpan.setAttribute(
          "data-counter",
          (Number(counterLike) + 1).toString()
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function unlikeBlog(blogId) {
  const data = {
    blogId: blogId,
  };
  fetch("/user/blog/api/unlike", {
    method: "DELETE", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (!result.isSuccess) {
        swal({
          title: "Error",
          text: "Lỗi rồi :(",
          icon: "error",
          button: "OK!",
        });
      } else {
        const counterLike = result.data.counterLike;
        likeSpan.innerHTML = `<span data-toggle="tooltip" class="mr-3" data-placement="bottom" title="Số lượt thích" onclick="likeBlog('${blogId}')" id="like-blog-btn">
                      <i class="far fa-thumbs-up"></i>
                    ${counterLike - 1}
            </span>`;
        likeSpan.setAttribute(
          "data-counter",
          (Number(counterLike) - 1).toString()
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function toTop() {
  window.scrollTo(0, 0);
}
