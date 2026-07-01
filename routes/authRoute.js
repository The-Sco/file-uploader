import { Router } from "express";
import authController from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/sign-up", authController.signUpGet);
authRouter.post("/sign-up", authController.signUpPost);
authRouter.get("/log-out", authController.logOutGet);
authRouter.get("/log-in", authController.logInGet);
authRouter.post("/log-in", authController.logInPost);

export default authRouter;
