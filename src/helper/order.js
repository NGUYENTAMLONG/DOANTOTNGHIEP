class Order {
  orderManga(mangas) {
    mangas.sort((a, b) => {
      if (a.contentId.chapters.length > 0 && b.contentId.chapters.length > 0) {
        return (
          new Date(b.contentId.chapters.slice(-1)[0].createdTime).getTime() -
          new Date(a.contentId.chapters.slice(-1)[0].createdTime).getTime()
        );
      }
    });
    return mangas;
  }
}

module.exports = new Order();
