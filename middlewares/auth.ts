import UserModel from "../models/user.js";
import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responses.js";
import { verifyAccessToken } from "../utils/auth-token.js";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return errorResponse(res, 401, {}, "Unauthorized");
    }

    const decodedToken = await verifyAccessToken(token);

    const user = await UserModel.findById(decodedToken.userId).select(
      "-password"
    );

    if (!user) {
      console.log("User not found for decoded token _id.");
      return errorResponse(res, 401, {}, "Invalid token");
    }

    req.user = {
      name: user?.name,
      _id: user?._id.toString(),
      email: user?.email,
    };

    next();
  } catch (error: any) {
    console.log(error);
    console.log("Token verification failed:", error.message);
    return errorResponse(res, 401, {}, "Token verification failed");
  }
};

export default authMiddleware;
