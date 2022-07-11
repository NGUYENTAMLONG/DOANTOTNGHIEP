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
  const chapterNumber = btn.dataset.chapternumber;
  const id = btn.dataset.id;
  const location = btn.dataset.location;
  modalBody_1.style.display = "none";
  modalBody_2.style.display = "block";

  backBtn.removeAttribute("hidden");
  fetch("/management/content/manga/allchapters/" + id)
    .then((res) => res.json())
    .then((result) => {
      const chapters = result.data.chapters;

      let getChapter = chapters.find((chapter, index) => {
        return chapter.chapterNumber === parseFloat(chapterNumber);
      });
      modalBody_2.innerHTML = getChapter.chapterContent;
    })
    .catch((error) => console.log(error));
}

function Back() {
  modalBody_1.style.display = "block";
  modalBody_2.style.display = "none";
  backBtn.setAttribute("hidden", "");
}
