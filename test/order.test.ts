import supertest from "supertest";
import { connectToDb, disconnectedFromDb } from "../src/app/database";
import { OrderTest, ProductTest, UserTest } from "./utils";
import { web } from "../src/app/web";

describe("GET /api/orders", () => {
  beforeEach(async () => {
    await connectToDb();
    await UserTest.createOne();
    await OrderTest.createOne();
  });

  afterEach(async () => {
    await OrderTest.deleteAll();
    await UserTest.deleteAll();
  });

  afterAll(async () => {
    await disconnectedFromDb();
  });

  it("should be able to get list of order", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).get("/api/orders").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data[0].user.name).toBe("test");
    expect(result.body.data[0].user.email).toBe("test@test.com");
    expect(result.body.data[0].orderItems[0].product.name).toBe("Krabby Patty");
  });

  it("should reject if the jwt is invalid", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).get("/api/orders").set("Authorization", `Bearer ${token}error`);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Unauthorized");
  });

  it("should return empty array if the order is empty", async () => {
    // delete all order
    await OrderTest.deleteAll();
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).get("/api/orders").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data).toHaveLength(0);
  });
});

describe("GET /api/orders/:orderId", () => {
  beforeEach(async () => {
    await connectToDb();
    await UserTest.createOne();
    await OrderTest.createOne();
  });

  afterEach(async () => {
    await OrderTest.deleteAll();
    await UserTest.deleteAll();
  });

  afterAll(async () => {
    await disconnectedFromDb();
  });

  it("should be able to get order by id", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    // get the order id
    const oid = await OrderTest.get();
    const oid_str = oid.toString();

    const result = await supertest(web).get(`/api/orders/${oid_str}`).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.user.name).toBe("test");
    expect(result.body.data.orderItems[0].product.name).toBe("Krabby Patty");
  });

  it("should return 404 if the order is not objectid format", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).get(`/api/orders/ngasalaebos`).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("input must be a 24 character hex string, 12 byte Uint8Array, or an integer");
  });
});

describe("POST /api/orders", () => {
  beforeEach(async () => {
    await connectToDb();
    await UserTest.createOne();
  });

  afterEach(async () => {
    await OrderTest.deleteAll();
    await UserTest.deleteAll();
  });

  afterAll(async () => {
    await disconnectedFromDb();
  });

  it("should be able to create an order", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const product = await ProductTest.get();

    const result = await supertest(web)
      .post(`/api/orders`)
      .set("Authorization", `Bearer ${token}`)
      .send([
        {
          productId: product._id,
          quantity: 4,
        },
      ]);

    expect(result.status).toBe(200);
    expect(result.body.data.orderItems[0].product).toBe("6655941ca1bdaffcbf4d7a95"); // change the id with the id of the product
    expect(result.body.data.orderItems[0].quantity).toBe(4);
    expect(result.body.data.orderItems[0].totalPrice).toBe(40);
  });

  it("should be able to create an order that have multiple item", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const product = await ProductTest.get();

    const result = await supertest(web)
      .post(`/api/orders`)
      .set("Authorization", `Bearer ${token}`)
      .send([
        {
          productId: product._id,
          quantity: 4,
        },
        {
          productId: product._id,
          quantity: 3,
        },
      ]);

    expect(result.status).toBe(200);
    expect(result.body.data.orderItems).toHaveLength(2);
  });

  it("should reject if the product id is incorrect", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();

    const result = await supertest(web)
      .post(`/api/orders`)
      .set("Authorization", `Bearer ${token}`)
      .send([
        {
          productId: "ngawur",
          quantity: 4,
        },
        {
          productId: "ngawur2",
          quantity: 3,
        },
      ]);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("input must be a 24 character hex string, 12 byte Uint8Array, or an integer");
  });
});

describe("PATCH /api/orders/:orderId", () => {
  beforeEach(async () => {
    await connectToDb();
    await UserTest.createOne();
    await OrderTest.createOne();
  });

  afterEach(async () => {
    await OrderTest.deleteAll();
    await UserTest.deleteAll();
  });

  afterAll(async () => {
    await disconnectedFromDb();
  });

  it("should be able to pay the order", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    // get the order id
    const oid = await OrderTest.get();
    const oid_str = oid.toString();

    const result = await supertest(web).patch(`/api/orders/${oid_str}`).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.isPaid).toBeTruthy;
  });

  it("should reject if the order id is not found", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();

    const result = await supertest(web).patch(`/api/orders/ngawur`).set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("input must be a 24 character hex string, 12 byte Uint8Array, or an integer");
  });
});
