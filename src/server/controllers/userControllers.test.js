const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/User");
const mockUser = require("../mocks/mockUser");

const { registerUser, LoginUser } = require("./userController");

jest.mock("../../database/models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(() => mockUser),
}));

jest.mock("bcrypt", () => ({ compare: jest.fn(), hash: jest.fn() }));

describe("Given a registerUser function", () => {
  describe("When it's invoked with a new user", () => {
    test("Then it should call the response method with a status 201 and the user", async () => {
      const req = {
        body: { name: "Pepito", username: "Grillo", password: "0000" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.create = jest.fn().mockResolvedValue(req.body);
      User.findOne = jest.fn().mockResolvedValue(false);

      const expectedStatus = 201;
      const expectedJson = { username: "Grillo" };

      bcrypt.hash.mockImplementation(() => "hashedPassword");

      await registerUser(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it is called with a user that is already in the database", () => {
    test("Then it should call the 'next' middleware function with an error", async () => {
      const req = {
        body: { name: "Pepito", username: "Grillo", password: "0000" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockNext = jest.fn();

      User.findOne.mockReturnThis(() => true);
      bcrypt.hash.mockReturnThis(() => "hashedPassword");

      await registerUser(req, res, mockNext);

      const expectedError = new Error();
      expectedError.statusCode = 409;
      expectedError.customMessage = "User name already exist";

      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a LoginUser function", () => {
  const req = {
    body: {
      username: "Pepito",
      password: "1234",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it receives a request with the correct username and password", () => {
    const token = "qwertasdfgzxcvbmloh";

    User.findOne = jest.fn().mockResolvedValue(true);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue(token);

    test("Then it should call a res status with code 200", async () => {
      const expectedStatus = 200;

      await LoginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });
});
