import UserModel from "../models/user.ts";

declare global {
  namespace Express {
    interface Request {
      user?: { _id: string; name: string; email?: string };
    }
  }
}
