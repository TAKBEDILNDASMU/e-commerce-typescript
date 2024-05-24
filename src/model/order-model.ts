import mongoose from "mongoose";
import { OrderInterface, OrderItem } from "./Order";
import { User } from "./User";

export type orderResponse = {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  orderAt: Date;
  user: mongoose.Types.ObjectId | User;
};

export type createOrderRequest = {
  productId: string;
  quantity: number;
};

const toOrderItemResponse = (orderItem: OrderItem[]): OrderItem[] => {
  return orderItem.map((order) => ({
    product: order.product,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
  }));
};

export const toOrderResponse = (orders: OrderInterface[]): Array<orderResponse> => {
  return orders.map((order) => ({
    _id: order._id,
    orderItems: toOrderItemResponse(order.orderItems),
    totalPrice: order.totalPrice,
    orderAt: order.orderAt,
    user: order.user,
  }));
};
