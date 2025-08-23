import express from "express";
import { handleRegisterController } from "../controllers/auth.js";
import { validate } from "../middlewares/validate.js";
import { UserSchema } from "../schemas/user.js";

const router = express.Router();

router.post("/sign-up", validate(UserSchema), handleRegisterController);

export default router;
