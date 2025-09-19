import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, getUserProfile,verifyEmail } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/profile",authMiddleware,getUserProfile);
router.get("/verify-email", verifyEmail);


export default router;