import { type Request, type Response } from "express";
import { User } from "../schemas/user";
import UserModel from "../models/user.js";
import { errorResponse, successResponse } from "../utils/responses";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { createAccessToken, createRefreshToken } from "../utils/auth-token.js";
import { getUserRefreshTokenKey, getUserSessionKey } from "../utils/keys.js";
import { RedisClient } from "../utils/redis-client.js";
import { v4 as uuidv4 } from "uuid";

export const handleRegisterController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body as User;
  console.log(req.body);
  try {
    let user = await UserModel.findOne({
      email,
    });
    if (user) {
      return errorResponse(res, 400, {}, "Email already in use");
    }

    const hashedPassword = await hashPassword(password);
    user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = await createAccessToken(user?._id.toString());
    const refreshToken = await createRefreshToken(user?._id.toString());

    const sessionId = uuidv4();
    const userSessionKey = await getUserSessionKey(
      user?._id.toString(),
      sessionId
    );

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    const client = await RedisClient();

    await client!.hSet(userSessionKey, {
      refreshToken,
      deviceId: sessionId,
      ip: Array.isArray(req.headers["x-forwarded-for"])
        ? req.headers["x-forwarded-for"][0]
        : req.headers["x-forwarded-for"] || req.socket.remoteAddress || "",
      userAgent: req.headers["user-agent"] || "",
      host: req.headers["host"] || "",
      referer: Array.isArray(req.headers["referer"])
        ? req.headers["referer"][0]
        : req.headers["referer"] || req.headers["referrer"] || "",
      acceptLanguage: Array.isArray(req.headers["accept-language"])
        ? req.headers["accept-language"][0]
        : req.headers["accept-language"] || "",
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    });

    return successResponse(
      res,
      201,
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      "User created"
    );
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse(res, 500, {}, "Internal server error");
  }
};

export const handleLoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return errorResponse(res, 400, {}, "Invalid email or password");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return errorResponse(res, 400, {}, "Invalid email or password");

    const accessToken = createAccessToken(user._id.toString());
    const refreshToken = createRefreshToken(user._id.toString());

    const sessionId = uuidv4();
    const userSessionKey = getUserSessionKey(user._id.toString(), sessionId);

    const client = await RedisClient();

    await client!.hSet(userSessionKey, {
      refreshToken,
      deviceId: sessionId,
      ip: Array.isArray(req.headers["x-forwarded-for"])
        ? req.headers["x-forwarded-for"][0]
        : req.headers["x-forwarded-for"] || req.socket.remoteAddress || "",
      userAgent: req.headers["user-agent"] || "",
      host: req.headers["host"] || "",
      referer: Array.isArray(req.headers["referer"])
        ? req.headers["referer"][0]
        : req.headers["referer"] || req.headers["referrer"] || "",
      acceptLanguage: Array.isArray(req.headers["accept-language"])
        ? req.headers["accept-language"][0]
        : req.headers["accept-language"] || "",
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    });
    await client!.expire(userSessionKey, 60 * 60 * 24 * 15);

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    return successResponse(
      res,
      200,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboardingCompleted: user?.isOnboardingCompleted,
        sessionId,
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, 500, {}, "Internal server error");
  }
};

export const handleLogoutController = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return errorResponse(res, 400, {}, "Session ID missing");
  }

  try {
    const client = await RedisClient();
    const userSessionKey = getUserSessionKey(userId, sessionId);

    await client!.del(userSessionKey);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("sessionId");

    return successResponse(res, 200, {}, "Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse(res, 500, {}, "Internal server error");
  }
};
