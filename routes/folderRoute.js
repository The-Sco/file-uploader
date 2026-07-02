import { Router } from "express";
import folderController from "../controllers/folderController.js";

const folderRoute = Router();

folderRoute.get("/single/:id", folderController.singleFolder);
folderRoute.get("/create", folderController.newFolderGet);
folderRoute.post("/create", folderController.newFolderPost);
folderRoute.post("/delete", folderController.deleteFolderPost);
folderRoute.get("/share/generate/:id", folderController.shareFolderGet);
folderRoute.post("/share/generate/:id", folderController.shareFolderPost);
folderRoute.get("/share/open/:id", folderController.sharedFolderGet);

export default folderRoute;
