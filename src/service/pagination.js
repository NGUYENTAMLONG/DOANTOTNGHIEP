function pagination(req, totalMangas) {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startPage = (page - 1) * limit;
  const endPage = page * limit;
  const result = {};
  if (startPage > 0) {
    result.previous = {
      previousPage: page - 1,
      limit: limit,
    };
  }
  if (endPage < totalMangas) {
    result.next = {
      nextPage: page + 1,
      limit: limit,
    };
  }
  return result;
}
module.exports = pagination;
