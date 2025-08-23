import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responses";

export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorResponse(res, 500, {}, "Interna server error");
};
