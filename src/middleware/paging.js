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
      if (endPage < (await model.countDocuments().exec())) {
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
        result.total = await model.countDocuments();
        req.handlePaging = result;
        // res.json({ HERE: result });
        next();
      } catch (error) {
        res.status(500).json({ from: "Paging section !!!", message: error });
      }
    };
  }
  PagingSearched() {
    return async (req, res, next) => {
      res.json("HEELO");
      const page = req.params.page;
      const limit = 5;
      const startPage = (page - 1) * limit;
      const endPage = page * limit;
      const result = {};
      const countManga = req.mangas;
      res.json(countManga);
      // if (startPage > 0) {
      //   result.previous = {
      //     previousPage: page - 1,
      //     limit: limit,
      //   };
      // }
      // if (endPage <  ) {

      // }
    };
  }
}
module.exports = new PagingClass();
