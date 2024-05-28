import { NextFunction, Response, Request } from "express";
import { UserRequest } from "../type/Request";
import { OrderService } from "../service/order-service";
import { createOrderRequest, getOrderRequest } from "../model/order-model";

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

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const request: getOrderRequest = req.params as getOrderRequest;
      const result = await OrderService.get(request);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: createOrderRequest[] = req.body as createOrderRequest[];
      const result = await OrderService.create(request, req.user!);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async pay(req: Request, res: Response, next: NextFunction) {
    try {
      const request: getOrderRequest = req.params as getOrderRequest;
      const result = await OrderService.pay(request);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
