import { Request, Response } from "express";
import slugify from "slugify";
import UserLinkModel from "../models/user-link";
import LinkModel from "../models/link";
import { errorResponse, successResponse } from "../utils/responses";

export const getUserLinks = async (req: Request, res: Response) => {
  const { _id } = req.user;
  try {
    const userLinks = await UserLinkModel.find({ user: _id });
    return successResponse(res, 200, userLinks, "User Links Fetched");
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, {}, "Failed to fetch user links");
  }
};

export const handleUpdateUserLink = async (req: Request, res: Response) => {
  const { _id } = req.user;
  const { link, url } = req.body;

  try {
    const orgLink = await LinkModel.findById(link);
    if (!orgLink) {
      return errorResponse(res, 404, {}, "Original link not found");
    }

    const userLink = await UserLinkModel.findOneAndUpdate(
      { user: _id, link, slug: orgLink.name },
      { slug: orgLink?.name, url },
      { new: true, upsert: true }
    );

    if (!userLink) {
      return errorResponse(
        res,
        500,
        {},
        "Failed to update or create user link"
      );
    }

    return successResponse(res, 200, {}, "User link created successfully");
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, {}, "Something went wrong");
  }
};
