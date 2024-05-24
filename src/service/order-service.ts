import Order from "../model/Order";
import { UserInterface } from "../model/User";
import { orderResponse, toOrderResponse } from "../model/order-model";

export class OrderService {
  static async list(user: UserInterface): Promise<Array<orderResponse>> {
    const results = await Order.find({ user: user._id })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          model: "Products",
        },
      })
      .populate("user");

    return toOrderResponse(results);
  }
}
