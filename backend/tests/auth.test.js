const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");
require("dotenv").config();

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);

  await User.deleteMany({});

  const res = await request(app).post("/api/auth/signup").send({
    fullName: "Test User",
    email: "test@test.com",
    password: "password123",
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Authentication Tests", () => {
  it("should signup a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      fullName: "Another User",
      email: "another@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("should login user with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should block access to protected route without token", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.statusCode).toBe(401);
  });

  it("should return current user when token is provided", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("test@test.com");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });
});
