import { sampleProducts, sampleUsers } from "../data";
import Order from "../model/Order";
import Product from "../model/Product";
import User from "../model/User";
import { seedResponse, toSeedResponse } from "../model/seed-model";

export class SeedService {
  static async seed(): Promise<seedResponse> {
    await Product.deleteMany({});
    const createdProduct = await Product.insertMany(sampleProducts);
    const krabbyPatty = await Product.create({
      name: "Krabby Patty",
      slug: "krabby-patty",
      category: "Food",
      image: "../images/p1.jpg",
      price: 10,
      countInStock: 100,
      brand: "Krusty Krab",
      rating: 4.9,
      numReviews: 100,
      description: "high quality burger",
    });

    await User.deleteMany({});
    const createdUser = await User.insertMany(sampleUsers);
    const patrick = await User.create({ name: "Patrick", email: "patrick@gmail.com", password: "IamPatrick" });

    await Order.deleteMany({});
    await Order.create({
      orderItems: [
        {
          product: krabbyPatty,
          quantity: 3,
          totalPrice: 9000,
        },
      ],
      totalPrice: 9000,
      orderAt: new Date(),
      user: patrick,
      products: krabbyPatty,
    });

    const createdOrder = await Order.find({})
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          model: "Products",
        },
      })
      .populate("user");

    return toSeedResponse(createdProduct, createdUser, createdOrder);
  }
}
