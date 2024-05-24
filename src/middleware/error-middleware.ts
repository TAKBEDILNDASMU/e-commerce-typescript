import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";
import { JsonWebTokenError } from "jsonwebtoken";

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      errors: `Validation Error: ${JSON.stringify(error)}`,
    });
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({
      errors: error.message,
    });
  } else if (error instanceof JsonWebTokenError) {
    res.status(401).json({
      errors: "Unauthorized",
    });
  } else {
    res.status(500).json({
      errors: error.message,
    });
  }
};
