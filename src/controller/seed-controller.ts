import { NextFunction, Request, Response } from "express";
import { SeedService } from "../service/seed-service";

export class SeedController {
  // execute this controller if you want to add product data and user data automatically
  static async seed(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SeedService.seed();

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
