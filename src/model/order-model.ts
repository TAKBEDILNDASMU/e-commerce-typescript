import mongoose from "mongoose";
import { OrderInterface, OrderItem } from "./Order";
import { User } from "./User";
import { Product } from "./Product";

export type orderResponse = {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  orderAt: Date;
  isPaid: boolean;
  user: mongoose.Types.ObjectId | User;
};

export type createOrderRequest = {
  productId: mongoose.Types.ObjectId | Product;
  quantity: number;
};

export type getOrderRequest = {
  orderId: string;
};

const toOrderItemResponse = (orderItem: OrderItem[]): OrderItem[] => {
  return orderItem.map((order) => ({
    product: order.product,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
  }));
};

export const toOrderResponse = (order: OrderInterface): orderResponse => {
  return {
    _id: order._id,
    orderItems: toOrderItemResponse(order.orderItems),
    totalPrice: order.totalPrice,
    orderAt: order.orderAt,
    isPaid: order.isPaid,
    user: order.user,
  };
};
