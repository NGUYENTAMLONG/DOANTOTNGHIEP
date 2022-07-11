// Tooltip & Searching by filter
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
$(document).ready(function () {
  $("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

// Control Modal
var modal = document.getElementById("myModal");

var modalImg = document.getElementById("preview-modal");
document.querySelectorAll(".manga-image").forEach((item, index) => {
  item.onclick = function () {
    modal.style.display = "block";
    modalImg.src = this.src;
  };
});

const span = document.getElementsByClassName("close-btn")[0];
span.onclick = function () {
  modal.style.display = "none";
};

// Review Chapter of DeletedManga
function showChapters(btn) {
  const id = btn.dataset.id;
  const slug = btn.dataset.slug;
  fetch(`/management/content/manga/deletedManga/allChapters/${id}`)
    .then((res) => res.json())
    .then((result) => {
      const chapters = result.data.chapters;
      console.log(result);
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

//Restore Manga
function restoreManga(slug) {
  fetch(`/management/content/manga/restoreManga/${slug}`, {
    method: "PATCH", // or 'PUT'
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess) {
        swal({
          title: "Thành công",
          text: "Đã khôi phục thành công !",
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
}

//Destroy Manga
function destroyManga(slug, contentId, imgPath) {
  const payload = {
    contentId,
    imgName: imgPath.split("/")[2],
  };
  swal({
    title: "Bạn có chắc chắn muốn xóa không",
    text: "Nếu xóa bạn không thể khôi phục truyện !",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      fetch(`/management/content/manga/destroyManga/${slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(payload),
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
