import { Router } from "express";
import { registerUserController, loginUserController, logoutUserController, refreshAccessToken, getUserProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout", logoutUserController);
router.post("/refreshAccesstoken", refreshAccessToken);
router.get("/profile",authMiddleware,getUserProfile);


export default router;