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
              <a href="/management/content/manga/updateChapter/${slug}/${id}/${
          chapter.chapterNumber
        }" class="btn btn-primary mr-3">Sửa</a>
              <button type="button" class="btn btn-danger" onclick="deleteChapter('${slug}','${id}','${
          chapter.chapterNumber
        }')">Xóa</button>
              </td>
           </tr>`;
      });
      document.querySelectorAll(
        ".modal-body"
      )[0].innerHTML = `<table class="table table-hover bg-dark text-light  tableChapters">
          <thead class="bg-warning text-dark ">
            <tr>
              <th scope="col" class="text-center">STT</th>
              <th scope="col" class="text-center col-chapterNumber" style="width:100px">Chương</th>
              <th scope="col" class="text-center">Tên</th>
              <th scope="col" class="text-center">Ngày đăng</th>
              <th scope="col">Tác vụ</th>
            </tr>
          </thead>
          <tbody id="myTable-Chapter">
            ${htmls.join("")}
          </tbody>
        </table>
        `;
      document.querySelector(
        ".modal-footer span"
      ).innerHTML = `<a type="button" href="/management/content/manga/post/${slug}" class="btn btn-success float-left btn-create-chapter">Đăng mới</a>`;

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
    title: "Bạn chắc chứ ?",
    text: "Việc xóa chương này sẽ có thể không khôi phục lại được >.<",
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
          data.isSuccess ? location.reload() : swal("Có lỗi xảy ra rồi :(");
        })
        .catch((error) => console.log(error));
    } else {
      swal({
        title: "Thông báo",
        text: "Đã hủy xóa !",
      });
    }
  });
}

//Delete Manga
function deleteManga(event, slug) {
  event.preventDefault();
  swal({
    title: "Bạn có chắc chắn muốn xóa không",
    text: "Nếu xóa bạn vẫn có thể khôi phục truyện !",
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
              title: "Thành công",
              text: "Đã xóa thành công !",
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
