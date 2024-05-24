import supertest from "supertest";
import User, { UserInterface } from "../src/model/User";
import bcrypt from "bcrypt";
import { web } from "../src/app/web";
import Product, { ProductInterface } from "../src/model/Product";
import { sampleProducts } from "../src/data";
import Order from "../src/model/Order";
import mongoose from "mongoose";

export class UserTest {
  static async createOne() {
    await User.create({
      name: "test",
      email: "test@test.com",
      password: await bcrypt.hash("test123", 10),
    });
  }

  static async deleteAll() {
    await User.deleteMany({
      email: "test@test.com",
    });
  }

  static async get(): Promise<UserInterface> {
    const user = await User.findOne({ email: "test@test.com" });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  static async update() {
    await User.updateOne(
      {
        email: "test@test.com",
      },
      {
        name: "newTest",
        password: await bcrypt.hash("newTest123", 10),
      }
    );
  }

  static async login(): Promise<any> {
    const { body } = await supertest(web).post("/api/users/login").send({
      email: "test@test.com",
      password: "test123",
    });

    return body.data.token;
  }
}

export class ProductTest {
  static async createMany() {
    await Product.create(sampleProducts);
  }

  static async deleteAll() {
    await Product.deleteMany();
  }

  static async get(): Promise<ProductInterface> {
    const product = await Product.findOne({ name: "Krabby Patty" });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }
}

export class OrderTest {
  static async createOne() {
    // get user test id first
    const user = await UserTest.get();
    const product = await ProductTest.get();
    await Order.create({
      orderItems: [
        {
          product: product,
          quantity: 5,
          totalPrice: 5 * 10,
        },
        {
          product: product,
          quantity: 2,
          totalPrice: 2 * 90,
        },
      ],
      totalPrice: 5 * 10 + 2 * 90,
      orderAt: new Date(),
      user: user._id,
    });
  }

  static async deleteAll() {
    // delete only the test user have
    const user = await UserTest.get();
    await Order.deleteOne({
      user: user._id,
    });
  }
}
