import searchDb from "../db/queries/searchQueries.js";

async function searchPost(req, res, next) {
  try {
    const { query } = req.body;
    const files = await searchDb.search(query);
    res.render("pages/search", { files: files || [], query });
  } catch (err) {
    next(err);
  }
}

const searchController = { searchPost };

export default searchController;
