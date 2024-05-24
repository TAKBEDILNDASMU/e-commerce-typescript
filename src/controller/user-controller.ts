import { NextFunction, Request, Response } from "express";
import { logger } from "../app/logger";
import { UserService } from "../service/user-service";
import { createUserRequest, loginRequest, updateRequest } from "../model/user-model";
import { UserRequest } from "../type/Request";

export class UserController {
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: createUserRequest = req.body as createUserRequest;
      const result = await UserService.register(request);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: loginRequest = req.body as loginRequest;
      const result = await UserService.login(request);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const result = await UserService.get(req.user!);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: updateRequest = req.body as updateRequest;
      const result = await UserService.update(req.user!, request);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
