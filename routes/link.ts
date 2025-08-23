import express from "express";

import { getAllLinks, handleBulkLinkUpload } from "../controllers/link";
import { validate } from "../middlewares/validate";
import { LinksSchema } from "../schemas/link";
const router = express.Router();

router.get("/", getAllLinks);
router.post("/upload", validate(LinksSchema), handleBulkLinkUpload);

export default router;
