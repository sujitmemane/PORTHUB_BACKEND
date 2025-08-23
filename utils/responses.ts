import { Response } from "express";

export const successResponse = async (
  res: Response,
  status: number = 200,
  data: any,
  message: string = "Success"
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = async (
  res: Response,
  status: number = 200,
  data: any,
  message: string = "Failed"
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};
