import homeDb from "../db/queries/homeQueries.js";
import fileDb from "../db/queries/fileQueries.js";
import upload from "../utils/fileUploader.js";
import cloudinaryV2 from "../utils/cloudinary.js";

async function uploadFileGet(req, res, next) {
  try {
    let errors = {};
    if (!req.user) {
      return res.redirect("/auth/log-in");
    }

    const selectedFolder = req.query?.folder || null;
    const folders = req.user.folders;
    if (folders.length === 0) {
      errors.folder = {
        msg: "Create folder first",
      };
    }
    res.render("forms/uploadFile", { selectedFolder, folders, errors });
  } catch (err) {
    next(err);
  }
}

async function checkFileSize(req, res, next) {
  try {
    const size = req.file.size;
    if (size > 50_000_000) {
      // 50~ mb
      const folders = await homeDb.getFolders(req.user.id);
      return res.render("forms/uploadFile", {
        folders,
        errors: {
          file: {
            msg: "File size cannot exceed 50 MB",
          },
        },
      });
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .send(
          "No file received. Double check your frontend field name is 'file'.",
        );
    }

    const { folder } = req.body;
    const fileName = req.file.originalname;
    const fileString = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinaryV2.uploader.upload(fileString, {
      resource_type: "auto",
    });

    const format = result.format || result.resource_type;
    const trueExtension = fileName.split(".").pop().toLowerCase();

    fileDb.uploadFile(
      fileName,
      result.secure_url,
      format,
      trueExtension,
      req.file.size,
      parseInt(folder),
    );

    res.redirect("/home");
  } catch (err) {
    next(err);
  }
}

const uploadFilePost = [upload.single("file"), checkFileSize, uploadFile];

async function singleFileGet(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect("/auth/log-in");
    }

    const fileId = req.params.id;
    const file = await fileDb.getFile(fileId);

    if (!file) {
      return res.render("errors/404");
    }

    const ownerId = file.folder.userId;
    const isOwner = ownerId == req.user?.id;

    if (!isOwner) {
      return res.render("errors/403");
    }

    let isReadable = false;
    let fileTextContent = "";
    const trueExtension = file.name.split(".").pop().toLowerCase();

    const textExtensions = ["txt", "csv", "json", "md", "html", "css", "js"];

    if (textExtensions.includes(trueExtension)) {
      isReadable = true;
      const response = await fetch(file.link);
      fileTextContent = await response.text();
    }

    const imgExtensions = ["jpg", "jpeg", "png", "webp", "avif"];
    const isImage = imgExtensions.includes(trueExtension);
    const formatedSize = (file.size / 1_000_000).toFixed(2);
    const folders = req.user.folders;

    res.render("pages/singleFile", {
      isOwner,
      file,
      isImage,
      isReadable,
      fileTextContent,
      formatedSize,
      folders,
    });
  } catch (err) {
    next(err);
  }
}

async function fileDeletePost(req, res, next) {
  try {
    const { fileId } = req.body;
    const file = await fileDb.getFile(fileId);
    const isOwner = req.user?.id == file.folder.userId;
    if (!isOwner) {
      return res.render("errors/404");
    }

    const publicId = file.link.split("/").pop().split(".")[0];
    const resource_type =
      file.extension.toLowerCase() === "raw" ? "raw" : "image";

    const cloudinaryResponse = await cloudinaryV2.uploader.destroy(publicId, {
      resource_type,
    });

    if (cloudinaryResponse.result !== "ok") {
      throw new Error(
        `Cloudinary deletion failed: ${cloudinaryResponse.result}`,
      );
    }

    await fileDb.deleteFile(fileId);
    res.redirect("/home");
  } catch (err) {
    next(err);
  }
}

const fileController = {
  uploadFileGet,
  uploadFilePost,
  singleFileGet,
  fileDeletePost,
};

export default fileController;
