import supertest from "supertest";
import { web } from "../src/app/web";
import { ProductTest, UserTest } from "./utils";
import { connectToDb, disconnectedFromDb } from "../src/app/database";

describe("GET /api/products", () => {
  beforeAll(async () => {
    await connectToDb();
  });

  beforeEach(async () => {
    await UserTest.createOne();
    await ProductTest.createMany();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
    await ProductTest.deleteAll();
  });

  it("should be able get all products data", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).get("/api/products").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data[0].name).toBe("Nike Slim shirt");
  });

  it("should reject if the jwt is invalid", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).get("/api/products").set("Authorization", `Bearer ${token}6X81032`);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Unauthorized");
  });
});

describe("GET /api/categories", () => {
  beforeEach(async () => {
    await UserTest.createOne();
    await ProductTest.createMany();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
    await ProductTest.deleteAll();
  });

  it("should be able get all products data", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).get("/api/products/categories").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data).toEqual(["Pants", "Shirts", "Shoes"]);
  });

  it("should reject if the jwt is not valid", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).get("/api/products/categories").set("Authorization", `Bearer ${token}Q32sfs`);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Unauthorized");
  });
});

describe("GET /api/products/:slug", () => {
  beforeEach(async () => {
    await UserTest.createOne();
    await ProductTest.createMany();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
    await ProductTest.deleteAll();
  });

  afterAll(async () => {
    await disconnectedFromDb();
  });

  it("should be able to get product by slug", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).get("/api/products/nike-slim-pant").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.slug).toBe("nike-slim-pant");
  });

  it("should return 404 if the product is not found", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).get("/api/products/thereisnothinghere").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Product is not found");
  });

  it("should reject if the jwt is not valid", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web)
      .get("/api/products/nike-slim-pant")
      .set("Authorization", `Bearer ${token}salah`);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Unauthorized");
  });
});
