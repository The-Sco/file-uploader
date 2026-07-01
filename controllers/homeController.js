import homeDb from "../db/queries/homeQueries.js";

async function homeGet(req, res, next) {
  try {
    let folders = [];
    let files = [];

    if (req.user) {
      const id = req.user.id;
      folders = req.user.folders;
      files = await homeDb.getFiles(id);
    }

    res.render("pages/home", { folders, files });
  } catch (err) {
    next(err);
  }
}

const homeController = {
  homeGet,
};

export default homeController;
