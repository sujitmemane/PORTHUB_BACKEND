import type { Response, Request, NextFunction } from "express";
import { ZodSchema } from "zod";
export const validate = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Schema validation failed",
        errors: result.error,
      });
    }
    next();
  };
};
