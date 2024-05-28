import express from "express";
import { UserController } from "../controller/user-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { ProductController } from "../controller/product-controller";
import { OrderController } from "../controller/order-controller";

export const apiRouter = express.Router();

// router that need to be authenticate

// User API
apiRouter.get("/api/users/profile", authMiddleware, UserController.get);
apiRouter.patch("/api/users/profile", authMiddleware, UserController.update);

// Product API
apiRouter.get("/api/products", authMiddleware, ProductController.list);
apiRouter.get("/api/products/categories", authMiddleware, ProductController.category);
apiRouter.get("/api/products/:slug", authMiddleware, ProductController.get);

// Order API
apiRouter.get("/api/orders", authMiddleware, OrderController.list);
apiRouter.post("/api/orders/", authMiddleware, OrderController.create);
apiRouter.get("/api/orders/:orderId", authMiddleware, OrderController.get);
apiRouter.patch("/api/orders/:orderId", authMiddleware, OrderController.pay);
