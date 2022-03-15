class PagingClass {
  PagingModel(model) {
    return async (req, res, next) => {
      //   res.json({ page: req.query.page, limit: req.query.limit });
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
      if (endPage < model.countDocuments().exec()) {
        result.next = {
          next: page + 1,
          limit: limit,
        };
      }
      try {
        result.resultPage = await model
          .find()
          .limit(limit)
          .skip(startPage)
          .exec();
        req.handlePaging = result;
        next();
      } catch (error) {
        res.status(500).json({ from: "Paging section !!!", message: error });
      }
    };
  }
}
module.exports = new PagingClass();
