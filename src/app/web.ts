import { publicRouter } from "../route/public-api";
import { errorMiddleware } from "../middleware/error-middleware";
import { apiRouter } from "../route/api";
import express, { NextFunction, Request, Response } from "express";
import { connectToDb } from "./database";

// connection to db
connectToDb();

// express initialization
export const web = express();

web.use(express.json());
web.use(publicRouter);
web.use(apiRouter);

// endpoint that not registered. throw 404
web.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: "404 page not found",
  });
});

web.use(errorMiddleware);
