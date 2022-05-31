const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const connectDB = require("../../database");
const User = require("../../database/models/User");
const app = require("..");
const mockUser = require("../mocks/mockUser");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  await User.create(mockUser[0]);
  await User.create(mockUser[1]);
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

      const response = await request(app)
        .post("/user/register")
        .send(newUserData)
        .expect(201);

      expect(response.body.id).not.toBeNull();
      expect(response.body.username).toBe("Grillo87");
    });
  });

  describe("When it receives a request with an existing user", () => {
    test("Then it should call the response method status code 409", async () => {
      const newUserData = {
        name: "Manolito",
        username: "Gafotas",
        password: "0000",
      };

      await User.create(newUserData);

      await request(app).post("/user/register").send(newUserData).expect(409);
    });
  });
});
