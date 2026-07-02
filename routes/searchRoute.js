import { Router } from "express";
import searchController from "../controllers/searchController.js";

const searchRoute = Router();

searchRoute.post("/", searchController.searchPost);

export default searchRoute;
