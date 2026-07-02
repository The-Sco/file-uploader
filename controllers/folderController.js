import folderDb from "../db/queries/folderQueries.js";
import homeDb from "../db/queries/homeQueries.js";
import { validationResult } from "express-validator";
import validateNewFolder from "../middlewares/validateNewFolder.js";
import validateShareFolder from "../middlewares/validateShareFolder.js";

async function singleFolder(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect("/auth/log-in");
    }

    const id = req.params.id;
    const folder = await folderDb.getFolder(id);

    if (!folder) {
      console.log("1 404 share folder");

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

async function shareFolderGet(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect("/auth/log-in");
    }

    const { id } = req.params;
    const folder = await folderDb.getFolder(id);

    if (!folder) {
      console.log("2 404 share folder");
      return res.render("errors/404");
    }

    if (!req.user.id == folder.userId) {
      return res.render("errors/403");
    }

    res.render("forms/shareFolder", { folder });
  } catch (err) {
    next(err);
  }
}

async function shareFolder(req, res, next) {
  try {
    const { duration } = req.body;
    const { id } = req.params;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(duration));

    const share = await folderDb.createShareFolder(id, expiresAt);
    const shareLink = `${req.protocol}://${req.get("host")}/folder/share/open/${share.id}`;
    res.render("pages/giveShareLink", { shareLink });
  } catch (err) {
    next(err);
  }
}

async function shareFolderIfErrors(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { id } = req.params;
      const folder = await folderDb.getFolder(id);
      return res.render("forms/shareFolder", {
        errors: errors.mapped(),
        data: req.body,
        folder,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
}

const shareFolderPost = [validateShareFolder, shareFolderIfErrors, shareFolder];

async function sharedFolderGet(req, res, next) {
  try {
    const { id } = req.params;
    const folder = await folderDb.getShareFolder(id);

    if (!folder) {
      console.log("3 404 share folder");
      return res.render("errors/404");
    }

    res.render("pages/sharedFolder", { folder: folder.folder, key: id });
  } catch (err) {
    next(err);
  }
}

const folderController = {
  singleFolder,
  newFolderGet,
  newFolderPost,
  deleteFolderPost,
  shareFolderGet,
  shareFolderPost,
  sharedFolderGet,
};

export default folderController;
