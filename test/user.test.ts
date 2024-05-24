import supertest from "supertest";
import { web } from "../src/app/web";
import { UserTest } from "./utils";
import { disconnectedFromDb } from "../src/app/database";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.deleteAll();
  });

  it("should be able to create user", async () => {
    const result = await supertest(web).post("/api/users").send({
      name: "test",
      email: "test@test.com",
      password: "test123",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.email).toBe("test@test.com");
    expect(result.body.data.isAdmin).toBe(false);
  });

  it("should reject if name, email, or password is undefined", async () => {
    const result = await supertest(web).post("/api/users").send({
      password: "test123",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if the email is not a valid email", async () => {
    const result = await supertest(web).post("/api/users").send({
      name: "test",
      email: "testinibro",
      password: "test123",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.createOne();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
  });

  it("should be able to logged in a user", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "test@test.com",
      password: "test123",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.email).toBe("test@test.com");
    expect(result.body.data.isAdmin).toBe(false);
    expect(result.body.data.token).toBeDefined();
  });

  it("should reject if the email is not found", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "testgagal@test.com",
      password: "test123",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Email or password incorrect!");
  });

  it("should reject if the password is incorrect", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "test@test.com",
      password: "test123gagal",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Email or password incorrect!");
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.createOne();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
  });
  it("should be able to get a user", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();

    const result = await supertest(web).get("/api/users/profile").set("Authorization", `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.email).toBe("test@test.com");
    expect(result.body.data.isAdmin).toBe(false);
  });

  it("should reject if the token is invalid", async () => {
    const token = await UserTest.login();
    const result = await supertest(web).get("/api/users/profile").set("Authorization", `Bearer ${token}fa123fs`);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Unauthorized");
  });
});

describe("PATCH /api/users/profile", () => {
  beforeEach(async () => {
    await UserTest.createOne();
  });

  afterEach(async () => {
    await UserTest.deleteAll();
  });

  afterAll(async () => {
    await disconnectedFromDb();
  });

  it("should be able to update a user", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).patch("/api/users/profile").set("Authorization", `Bearer ${token}`).send({
      name: "newTest",
      password: "newTest123",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("newTest");
    expect(result.body.data.email).toBe("test@test.com");
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.data.isAdmin).toBe(false);
  });

  it("should be able to update only with the name", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).patch("/api/users/profile").set("Authorization", `Bearer ${token}`).send({
      name: "newTest",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("newTest");
    expect(result.body.data.email).toBe("test@test.com");
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.data.isAdmin).toBe(false);
  });

  it("should be able to update only with the password", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).patch("/api/users/profile").set("Authorization", `Bearer ${token}`).send({
      password: "newTest123",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.email).toBe("test@test.com");
    expect(result.body.data.password).toBeUndefined();
    expect(result.body.data.isAdmin).toBe(false);
  });

  it("should reject if the password is incorrect", async () => {
    // login first to get the jwt token
    const token = await UserTest.login();
    const result = await supertest(web).patch("/api/users/profile").set("Authorization", `Bearer ${token}`).send({
      name: "newTest",
      password: "new",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if the jwt is invalid", async () => {
    const result = await supertest(web).patch("/api/users/profile").set("Authorization", `random token`).send({
      name: "newTest",
      password: "newTest123",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Unauthorized");
  });
});
