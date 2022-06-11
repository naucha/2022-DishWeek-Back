const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectDB = require("../../database");
const User = require("../../database/models/User");
const app = require("..");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoServer.stop();
  await mongoose.connection.close();
});

describe("Given a POST '/register' endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should receive a object with a new created user", async () => {
      const newUserData = {
        name: "Pepito",
        username: "Grillo87",
        password: "0000",
      };

      await request(app).post("/user/register").send(newUserData).expect(201);
    });
  });
});
