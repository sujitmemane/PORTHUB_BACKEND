import { Request, Response } from "express";

import { errorResponse, successResponse } from "../utils/responses";
import UserModel from "../models/user.ts";
import LinkModel from "../models/link";
import UserLinkModel from "../models/user-link";
import slugify from "slugify";
import { UpdateUser } from "../schemas/user.ts";

const DICE_BEAR_STYLES = [
  "adventurer",
  "avataaars",
  "big-ears",
  "big-smile",
  "bottts",
  "croodles",
  "dylan",
  "fun-emoji",
  "glass",
  "icons",
  "identicon",
  "initials",
  "lorelei",
  "micah",
  "miniavs",
  "notionists",
  "open-peeps",
  "personas",
  "pixel-art",
  "pixel-art-neutral",
];

const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #91a7ff 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
];

export const getUserAvatarList = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { email, name } = req.user;
    const nameInitials = (name?: string) => {
      if (!name) return "US";

      return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("");
    };

    console.log(nameInitials, "ini");

    const svg = `https://api.dicebear.com/9.x/initials/svg?seed=${nameInitials(
      name
    )}`;

    const urls = DICE_BEAR_STYLES.map(
      (style) => `https://api.dicebear.com/9.x/${style}/svg?seed=${email}`
    );

    const result = [svg, ...urls];

    return successResponse(res, 200, result, "Avatar fetchwed");
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, {}, error?.message);
  }
};

export const getUserBackgroundBanner = async (req: Request, res: Response) => {
  try {
    return successResponse(res, 200, GRADIENTS);
  } catch (error) {}
};

export const handleUserOnboarding = async (req: Request, res: Response) => {
  const { name, username, bio, bgColor, bgText, avatar } = req.body;
  const { _id } = req.user;

  try {
    const existingUser = await UserModel.findOne({
      username,
      _id: { $ne: _id },
    });
    if (existingUser) {
      return errorResponse(res, 400, {}, "Username already taken");
    }

    const user = await UserModel.findByIdAndUpdate(
      _id,
      {
        name,
        username,
        bio,
        banner: { bgColor, bgText },
        avatar,
        isOnboardingCompleted: true,
      },
      { new: true }
    );

    if (!user) {
      return errorResponse(res, 404, {}, "User not found");
    }

    return successResponse(res, 200, user, "User onboarded successfully");
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, {}, "Internal Server Error");
  }
};

export const handleUpdateUser = async (req: Request, res: Response) => {
  const { _id } = req.user;

  try {
    const { name, bio, aboutMe, quickIntros } = req.data as UpdateUser;

    const user = await UserModel.findById(_id);
    if (!user) {
      return errorResponse(res, 404, {}, "User not found");
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (aboutMe !== undefined) user.aboutMe = aboutMe;
    if (quickIntros !== undefined) user.quickIntros = quickIntros;

    await user.save();

    return successResponse(res, 200, user, "User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    return errorResponse(res, 500, {}, "Internal server error");
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const { _id } = req.user;
  try {
    const user = await UserModel.findById(_id);
    if (!user) {
      return errorResponse(res, 404, {}, "User not found");
    }

    return successResponse(res, 200, user, "User onboarded successfully");
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, {}, "Internal Server Error");
  }
};
