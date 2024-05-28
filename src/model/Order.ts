import mongoose, { Document, Schema, model } from "mongoose";
import { User } from "./User";
import { Product } from "./Product";

export interface OrderItem {
  product: mongoose.Types.ObjectId | Product;
  quantity: number;
  totalPrice: number;
}

// order interface
export interface OrderInterface extends Document {
  orderItems: OrderItem[];
  totalPrice: number;
  orderAt: Date;
  user: mongoose.Types.ObjectId | User;
  isPaid: boolean;
  product: mongoose.Types.ObjectId | Product;
}

export interface Order {
  orderItems: OrderItem[];
  totalPrice: number;
  orderAt: Date;
  isPaid: boolean;
  user: mongoose.Types.ObjectId | User;
  product: mongoose.Types.ObjectId | Product;
}

const OrderSchema = new Schema<OrderInterface>({
  orderItems: [
    {
      product: { type: mongoose.Types.ObjectId, required: true, ref: "Products" },
      quantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  orderAt: { type: Date, required: true },
  isPaid: { type: Boolean, required: true, default: false },
  user: { type: mongoose.Types.ObjectId, required: true, ref: "Users" },
});

const Order = model<OrderInterface>("Orders", OrderSchema);

export default Order;
