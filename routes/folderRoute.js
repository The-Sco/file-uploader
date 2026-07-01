import { Router } from "express";
import folderController from "../controllers/folderController.js";

const folderRoute = Router();

folderRoute.get("/single/:id", folderController.singleFolder);
folderRoute.get("/create", folderController.newFolderGet);
folderRoute.post("/create", folderController.newFolderPost);
folderRoute.post("/delete", folderController.deleteFolderPost);

export default folderRoute;
