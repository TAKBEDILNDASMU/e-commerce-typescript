import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../env";
import { UserRequest } from "../type/Request";
import { UserInterface } from "../model/User";
import User from "../model/User";
import { ResponseError } from "../error/response-error";
import { logger } from "../app/logger";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new ResponseError(401, "Unauthorized");
  }

  try {
    // remove the Bearer string
    const token = authorization.slice(7, authorization.length);
    const decode = jwt.verify(token, env.JWT_SECRET) as UserInterface;

    // check if the user exist or not in the db
    const user = await User.findById(decode._id);
    if (user) {
      req.user = decode;
      next();
      return;
    }
  } catch (error) {
    logger.info(error);
    next(error);
  }
};
