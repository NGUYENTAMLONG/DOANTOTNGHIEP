//Pagination
const pagingObj = {
  dataSource: "/newmanga/list",
  locator: "newMangas",
  showGoInput: true,
  showGoButton: true,
  totalNumberLocator: function (response) {
    return response.newMangas.length;
  },
  pageSize: 2,
  callback: showListAfterPaging,
};

$("#paging-1").pagination(pagingObj);

function showListAfterPaging(data, pagination) {
  $(".manga-container").html("");
  $.ajax({
    url: `/newmanga/list?page=${pagination.pageNumber}&limit=${pagination.pageSize}`,
  })
    .then((rs) => {
      console.log(rs.newMangas);
      for (var i = 0; i < rs.newMangas.length; i++) {
        const manga = rs.newMangas[i];
        const htmls = `<div class="col-sm-4 col-md-3 col-lg-2 p-2">
    <div class="manga-card">
      ${manga.hot ? "<span class='manga-tag__hot'>Hot</span>" : ""}
      ${
        manga.contentId.chapters.length !== 0
          ? `<span class="manga-tag__period" style="font-size: 13px;text-transform: capitalize;"> ${moment(
              manga.contentId.chapters[0].createdTime
            )
              .locale("vi")
              .fromNow()}</span>`
          : `<span class="manga-tag__period" style="font-size: 13px;text-transform: capitalize;"> 
        Chưa công bố
        </span>`
      }
      <a href="/detail/${manga.slug}">
        <img class="card-img-top manga-img" src="${
          manga.image
        }" alt="Card image cap" />
      </a>
      <div class="manga-title div-template" data-template="${manga._id}">
        <a class="manga-name" href="/detail/${manga.slug}">
          <h5>${manga.name}</h5>
        </a>
        <a href="/detail/${manga.slug}" class="manga-chapter">
          ${
            manga.contentId.chapters.length == 0
              ? "Chưa công bố"
              : "Chương " + manga.contentId.chapters.slice(-1)[0].chapterNumber
          }
        </a>
      </div>
      <div id="template-${manga._id}" style="display: none;">
        <div class="info text-light">
          <h4 class="info__name">${manga.name}</h4>
          <p class="info__another-name"><b>Tên khác:</b> ${
            manga.anotherName
          }</p>
          <ul class="info__follows">
            <li>
              Tình trạng: <b>${manga.status}</b>
            </li>
            <li>
              Lượt xem: <b>${manga.statistical.views}</b>
            </li>
            <li>
              Bình luận: <b>${manga.statistical.comments}</b>
            </li>
          </ul>
          <div class="info__type">
            <b>Thể loại:</b>
            ${manga.type.map((item) => {
              return `<a href="/category/${item}">${item}</a>`;
            })}
          </div>
          <p class="info__desc">
            ${manga.description}
          </p>
        </div>
      </div>
    </div>
    </div>`;
        $(".manga-container").append(htmls);
      }
    })
    .then(() => {
      // Tippy tooltip js library
      tippy(`.div-template`, {
        content(reference) {
          const id = reference.getAttribute("data-template");
          const template = document.getElementById(`template-${id}`);
          return template.innerHTML;
        },
        allowHTML: true,
        interactive: true,
        followCursor: true,
        placement: "right-end",
        arrow: true,
      });
    })
    .catch((error) => console.log(error));
}
