import folderDb from "../db/queries/folderQueries.js";
import homeDb from "../db/queries/homeQueries.js";
import { validationResult } from "express-validator";
import validateNewFolder from "../middlewares/validateNewFolder.js";

async function singleFolder(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect("/auth/log-in");
    }

    const id = req.params.id;
    const folder = await folderDb.getFolder(id);

    if (!folder) {
      return res.render("errors/404");
    }

    const folders = req.user.folders;
    const isOwner = folder.userId == req.user.id;

    if (!isOwner) {
      return res.render("errors/403");
    }

    res.render("pages/singleFolder", { folder, folders });
  } catch (err) {
    next(err);
  }
}

function newFolderGet(req, res, next) {
  if (!req.user) {
    return res.redirect("/auth/log-in");
  }
  try {
    res.render("forms/newFolder", { folders: req.user.folders });
  } catch (err) {
    next(err);
  }
}

async function ifErrorsNewFolder(req, res, next) {
  try {
    const { title } = req.body;
    const errors = validationResult(req);
    const doesExist = await folderDb.checkIfFolderExists(title, req.user.id);
    if (!errors.isEmpty() || doesExist) {
      if (doesExist) {
        return res.render("forms/newFolder", {
          errors: {
            title: {
              msg: "Folder already exists",
            },
          },
          data: req.body,
        });
      }
      return res.render("forms/newFolder", {
        errors: errors.mapped(),
        data: req.body,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function newFolder(req, res, next) {
  if (!req.user) {
    return res.redirect("/auth/log-in");
  }
  try {
    const { title } = req.body;
    await folderDb.createFolder(title, req.user.id);
    return res.redirect("/home");
  } catch (err) {
    next(err);
  }
}

async function deleteFolderPost(req, res, next) {
  try {
    const { folderId } = req.body;
    const folder = await folderDb.getFolder(folderId);
    const isOwner = req.user?.id == folder.userId;
    if (!isOwner) {
      return res.render("errors/403");
    }

    await folderDb.deleteFolder(folderId, req.user.id);
    return res.redirect("/home");
  } catch (err) {
    next(err);
  }
}

const newFolderPost = [validateNewFolder, ifErrorsNewFolder, newFolder];

const folderController = {
  singleFolder,
  newFolderGet,
  newFolderPost,
  deleteFolderPost,
};

export default folderController;
