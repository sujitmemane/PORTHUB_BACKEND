import express from "express";

import {
  getUserSkill,
  handleAddSkill,
  handleCreateCategory,
  handleDeleteCategory,
  handleDeleteSkill,
} from "../controllers/skill";
import authMiddleware from "../middlewares/auth";

const router = express.Router();

router.get("/", authMiddleware, getUserSkill);
router.post("/categories", authMiddleware, handleCreateCategory);
router.delete("/categories", authMiddleware, handleDeleteCategory);
router.post("/categories/skills", authMiddleware, handleAddSkill);
router.delete("/categories/skills", authMiddleware, handleDeleteSkill);

export default router;
