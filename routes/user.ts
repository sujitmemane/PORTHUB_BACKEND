import express from "express";
import {
  getUserAvatarList,
  getUserBackgroundBanner,
  getUserProfile,
  handleUserOnboarding,
} from "../controllers/user";
import authMiddleware from "../middlewares/auth";
const router = express.Router();

router.get("/avatars", authMiddleware, getUserAvatarList);
router.get("/profile", authMiddleware, getUserProfile);
router.get("/backgrounds", authMiddleware, getUserBackgroundBanner);
router.post("/onboarding", authMiddleware, handleUserOnboarding);

export default router;
