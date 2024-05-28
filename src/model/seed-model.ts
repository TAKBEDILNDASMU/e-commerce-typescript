import { OrderInterface } from "./Order";
import { ProductInterface } from "./Product";
import { UserInterface } from "./User";
import { orderResponse, toOrderResponse } from "./order-model";
import { productResponse, toProductResponse } from "./product-model";
import { toUserResponse, userResponse } from "./user-model";

export type seedResponse = {
  createdProduct: productResponse[];
  createdUser: userResponse[];
  createdOrder: orderResponse[];
};

export const toSeedResponse = (
  products: ProductInterface[],
  users: UserInterface[],
  orders: OrderInterface[]
): seedResponse => {
  return {
    createdProduct: products.map((product) => toProductResponse(product)),
    createdUser: users.map((user) => toUserResponse(user)),
    createdOrder: orders.map((order) => toOrderResponse(order)),
  };
};
