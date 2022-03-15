const backBtn = document.querySelector(".btn-back");
backBtn.setAttribute("hidden", "");
const modalBody_1 = document.querySelectorAll(".modal-body")[0];
const modalBody_2 = document.querySelectorAll(".modal-body")[1];

$(document).ready(function () {
  $(".launch-modal").click(function () {
    $("#modalChapters").modal({
      backdrop: "static",
    });
  });
});
function Close() {
  modalBody_1.style.display = "block";
  modalBody_2.style.display = "none";
  backBtn.setAttribute("hidden", "");
}
function Review(btn, i) {
  const id = btn.dataset.id;
  const location = btn.dataset.location;
  modalBody_1.style.display = "none";
  modalBody_2.style.display = "block";

  backBtn.removeAttribute("hidden");
  fetch("/manage/admin_manga/manga/" + id)
    .then((res) => res.json())
    .then((data) => {
      let htmls = data.chapters[location].chapterImages.map((img, index) => {
        return `
        <div class="row d-flex justify-content-center m-2">
        <img src="${img}" alt="img-chapter" />
        </div>
        `;
      });
      modalBody_2.innerHTML = htmls.join("");
    })
    .catch((error) => console.log(error));
}

function Back() {
  modalBody_1.style.display = "block";
  modalBody_2.style.display = "none";
  backBtn.setAttribute("hidden", "");
}
