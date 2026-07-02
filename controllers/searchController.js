import searchDb from "../db/queries/searchQueries.js";

async function searchPost(req, res, next) {
  try {
    const { query } = req.body;
    const userId = req.user?.id;
    let files = [];
    if (userId) {
      files = await searchDb.search(query, userId);
    }
    res.render("pages/search", { files, query });
  } catch (err) {
    next(err);
  }
}

const searchController = { searchPost };

export default searchController;
