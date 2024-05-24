import { Request, Response, NextFunction } from "express";
import { ProductService } from "../service/product-service";
import { getProductRequest } from "../model/product-model";

export class ProductController {
  public static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.list();

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async category(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.category();

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const request: getProductRequest = req.params as getProductRequest;
      const result = await ProductService.get(request);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
