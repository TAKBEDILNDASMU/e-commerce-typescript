import { NextFunction, Response } from "express";
import { UserRequest } from "../type/Request";
import { OrderService } from "../service/order-service";

export class OrderController {
  static async list(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.list(req.user!);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
