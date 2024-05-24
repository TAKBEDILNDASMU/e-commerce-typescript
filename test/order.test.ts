import supertest from "supertest";
import { disconnectedFromDb } from "../src/app/database";
import { OrderTest, UserTest } from "./utils";
import { web } from "../src/app/web";
import User from "../src/model/User";

describe("GET /api/orders", () => {
  beforeEach(async () => {
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

    console.info(result.body.data[0].orderItems[0]);
    expect(result.status).toBe(200);
    expect(result.body.data[0].user.name).toBe("test");
    expect(result.body.data[0].user.email).toBe("test@test.com");
    expect(result.body.data[0].orderItems[0].product.name).toBe("Krabby Patty");
  });
});
