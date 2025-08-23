import LinkModel from "../models/link";

import { errorResponse, successResponse } from "../utils/responses";
import { Request, Response } from "express";

export const handleBulkLinkUpload = async (req: Request, res: Response) => {
  const { links } = req.body;
  try {
    const upload = await LinkModel.insertMany(links);
    return successResponse(res, 201, upload, "Links Uploaded");
  } catch (error) {
    console.error(error);
    return errorResponse(res, 404, {}, "User not found");
  }
};

export const getAllLinks = async (req: Request, res: Response) => {
  try {
    const links = await LinkModel.find({});
    console.log(links, "cheap");
    return successResponse(res, 201, links, "Links Uploaded");
  } catch (error) {
    console.error(error);
    return errorResponse(res, 404, {}, "User not found");
  }
};
