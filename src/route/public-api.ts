import express, { Request, Response } from "express";
import { UserController } from "../controller/user-controller";
import { SeedController } from "../controller/seed-controller";

export const publicRouter = express.Router();

// Public router doesn't need to authenticate
publicRouter.post("/api/users", UserController.register);
publicRouter.post("/api/users/login", UserController.login);

// hit this endpoint if you want to add user and product data automatically
publicRouter.get("/api/addyourdataboi", SeedController.seed);
