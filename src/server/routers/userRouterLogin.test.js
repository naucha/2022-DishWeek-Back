const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const app = require("../index");
const connectDB = require("../../database");
const User = require("../../database/models/User");
const { mockUser } = require("../mocks/mockUser");

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

describe("Given a POST '/user/login' endpoint", () => {
  describe("When it receives a request with an existing user but wrong password", () => {
    test("Then it should call the response method status code 200", async () => {
      const userData = {
        username: "Gafotas",
        password: "0000",
      };

      const {
        body: { token },
      } = await request(app).post("/user/login").send(userData).expect(403);

      expect(token).not.toBeNull();
    });
  });
});
