import { ResponseError } from "../error/response-error";
import Order, { OrderItem } from "../model/Order";
import Product from "../model/Product";
import { UserInterface } from "../model/User";
import { createOrderRequest, getOrderRequest, orderResponse, toOrderResponse } from "../model/order-model";
import { OrderValidation } from "../validation/order-validation";
import { Validation } from "../validation/validation";

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

    return results.map((result) => ({
      _id: result._id,
      orderItems: result.orderItems,
      totalPrice: result.totalPrice,
      orderAt: result.orderAt,
      isPaid: result.isPaid,
      user: result.user,
    }));
  }

  static async get(request: getOrderRequest): Promise<orderResponse> {
    const getRequest = Validation.validate(OrderValidation.GET, request);
    const result = await Order.findById(getRequest.orderId)
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          model: "Products",
        },
      })
      .populate("user");

    if (!result) {
      throw new ResponseError(404, "Order is not found");
    }

    return toOrderResponse(result);
  }

  static async create(request: createOrderRequest[], user: UserInterface): Promise<orderResponse> {
    const createRequest = Validation.validate(OrderValidation.CREATE, request);

    // get the information of product
    const productsPromises = createRequest.map((order) => {
      return Product.findById(order.productId);
    });

    const products = await Promise.all(productsPromises);
    const orderItems: OrderItem[] = createRequest.map((order, i) => ({
      product: order.productId,
      quantity: order.quantity,
      totalPrice: products[i]!.price * order.quantity,
    }));

    // TODO: think how to refactor the totalPrice property in orderItems
    // Because user may can manipulate the id of product
    const order = await Order.create({
      orderItems: orderItems,
      totalPrice: orderItems.reduce((acc, orderItems) => acc + orderItems.totalPrice, 0),
      orderAt: new Date(),
      user: user._id,
    });

    return toOrderResponse(order);
  }

  static async pay(request: getOrderRequest): Promise<orderResponse> {
    const payRequest = Validation.validate(OrderValidation.GET, request);
    const order = await Order.findById(payRequest.orderId);

    if (!order) {
      throw new ResponseError(404, "Order is not found");
    }

    const result = await Order.findOneAndUpdate(
      {
        _id: order._id,
      },
      {
        isPaid: true,
      }
    );

    if (!result) {
      throw new ResponseError(404, "Order is not found");
    }

    return toOrderResponse(result);
  }
}
