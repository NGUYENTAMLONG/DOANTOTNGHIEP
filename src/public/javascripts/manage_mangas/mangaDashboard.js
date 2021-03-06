//Searching using filter bootstrap & jquery
$(document).ready(function () {
  $("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

//Turn on turn off modal
function zoomImg(it) {
  var modal = document.getElementById("myModal");
  var modalImg = document.getElementById("preview-modal");

  modal.style.display = "block";
  modalImg.src = it.src;
}

function closeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

//Show Chapter List Of Manga
function showChapters(btn) {
  const id = btn.dataset.id;
  const slug = btn.dataset.slug;

  fetch("/management/content/manga/allchapters/" + id)
    .then((res) => res.json())
    .then((result) => {
      const chapters = result.data.chapters;
      document.querySelector(".chapterSum").innerHTML = chapters.length;
      let htmls = chapters.map((chapter, index) => {
        return `<tr>
             <th scope="row" class="text-center">
               ${index + 1}
             </th>
             <td class="text-center col-chapterNumber"> <span class="badge badge-primary ">${
               chapter.chapterNumber
             }</span></td>
             <td class="col-chapterName" data-toggle="tooltip" data-placement="bottom" title="${
               chapter.chapterName
             }" >${chapter.chapterName}</td>
             <td class="text-center">${moment(chapter.createdTime).format(
               "L"
             )}</td>
             <td class="text-right d-flex justify-content-center"> 
              <button type="button" class="btn btn-warning mr-3" data-id="${id}" data-chapternumber="${
          chapter.chapterNumber
        }" data-location="${index}" onclick="Review(this)">Xem</button>
              
              <form action="/management/content/manga/updateChapter" method="POST">
                <input type="text" name="chapterId" value="${id}" hidden>
                <input type="text" name="manga" value="${slug}" hidden>
                <input type="text" name="chapterNumber" value="${
                  chapter.chapterNumber
                }" hidden>
                <button type="submit" class="btn btn-primary mr-3">S???a</button>
              </form>

              <button type="button" class="btn btn-danger" onclick="deleteChapter('${slug}','${id}','${
          chapter.chapterNumber
        }')">X??a</button>
              </td>
           </tr>`;
      });
      document.querySelectorAll(
        ".modal-body"
      )[0].innerHTML = `<table class="table table-hover bg-dark text-light  tableChapters">
          <thead class="bg-warning text-dark ">
            <tr>
              <th scope="col" class="text-center">STT</th>
              <th scope="col" class="text-center col-chapterNumber" style="width:100px">Ch????ng</th>
              <th scope="col" class="text-center">T??n</th>
              <th scope="col" class="text-center">Ng??y ????ng</th>
              <th scope="col">T??c v???</th>
            </tr>
          </thead>
          <tbody id="myTable-Chapter">
            ${htmls.join("")}
          </tbody>
        </table>
        `;
      document.querySelector(
        ".modal-footer span"
      ).innerHTML = `<a type="button" href="/management/content/manga/post/${slug}" class="btn btn-success float-left btn-create-chapter">????ng m???i</a>`;

      $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });
      $(document).ready(function () {
        $("#myInput-Chapter").on("keyup", function () {
          var value = $(this).val().toLowerCase();
          $("#myTable-Chapter tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
          });
        });
      });
    })
    .catch((error) => console.log(error));
}

//Delete Chapter
function deleteChapter(manga, chapterId, chapterNumber) {
  swal({
    title: "B???n ch???c ch??? ?",
    text: "Vi???c x??a ch????ng n??y s??? c?? th??? kh??ng kh??i ph???c l???i ???????c >.<",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      const payload = {
        manga: manga.trim(),
        chapterId: chapterId.trim(),
        chapterNumber: chapterNumber.trim(),
      };
      fetch(`/management/content/manga/deleteChapter`, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          data.isSuccess ? location.reload() : swal("C?? l???i x???y ra r???i :(");
        })
        .catch((error) => console.log(error));
    } else {
      swal({
        title: "Th??ng b??o",
        text: "???? h???y x??a !",
      });
    }
  });
}

//Delete Manga
function deleteManga(event, slug) {
  event.preventDefault();
  swal({
    title: "B???n c?? ch???c ch???n mu???n x??a kh??ng",
    text: "N???u x??a b???n v???n c?? th??? kh??i ph???c truy???n !",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      fetch(`/management/content/manga/deleteManga/${slug}`, {
        method: "DELETE", // or 'PUT'
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isSuccess) {
            swal({
              title: "Th??nh c??ng",
              text: "???? x??a th??nh c??ng !",
              icon: "success",
              button: "Ok!",
            }).then(() => {
              location.reload();
            });
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } else {
      return;
    }
  });
}
