$(document).ready(function () {
  $(".launch-modal").click(function () {
    $("#modalChapters").modal({
      backdrop: "static",
    });
  });
});
function Close() {
  const backBtn = document.querySelector(".btn-back");
  const modalBody_1 = document.querySelectorAll(".modal-body")[0];
  const modalBody_2 = document.querySelectorAll(".modal-body")[1];
  modalBody_1.style.display = "block";
  modalBody_2.style.display = "none";
  backBtn.setAttribute("hidden", "");
}
function Review(btn, i) {
  const backBtn = document.querySelector(".btn-back");
  const modalBody_1 = document.querySelectorAll(".modal-body")[0];
  const modalBody_2 = document.querySelectorAll(".modal-body")[1];
  const chapterNumber = btn.dataset.chapternumber;
  const id = btn.dataset.id;
  modalBody_1.style.display = "none";
  modalBody_2.style.display = "block";
  // const modalHeader = document.querySelector(".modal-header");

  backBtn.removeAttribute("hidden");
  fetch("/management/content/manga/allchapters/" + id)
    .then((res) => res.json())
    .then((result) => {
      const chapters = result.data.chapters;

      let getChapter = chapters.find((chapter, index) => {
        return chapter.chapterNumber === parseFloat(chapterNumber);
      });
      modalBody_2.innerHTML = `<h5 class="modal-title text-dark bg-warning" id="modalChaptersLabel">Chương ${getChapter.chapterNumber} - ${getChapter.chapterName}
              </h5> <br> ${getChapter.chapterContent}`;
    })
    .catch((error) => console.log(error));
}

function Back() {
  const backBtn = document.querySelector(".btn-back");
  const modalBody_1 = document.querySelectorAll(".modal-body")[0];
  const modalBody_2 = document.querySelectorAll(".modal-body")[1];
  modalBody_1.style.display = "block";
  modalBody_2.style.display = "none";
  backBtn.setAttribute("hidden", "");
}
