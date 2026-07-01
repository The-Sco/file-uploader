import { Router } from "express";
import fileController from "../controllers/fileController.js";

const fileRoute = Router();

fileRoute.get("/upload", fileController.uploadFileGet);
fileRoute.post("/upload", fileController.uploadFilePost);
fileRoute.get("/single/:id", fileController.singleFileGet);
fileRoute.post("/delete", fileController.fileDeletePost);

export default fileRoute;
