import UserModel from "../models/user.ts";
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: { _id: Types.ObjectId; name: string; email?: string };
    }
  }
}
