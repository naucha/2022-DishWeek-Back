const bcrypt = require("bcrypt");
const User = require("../../database/models/User");

const { registerUser } = require("./userController");

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
      const expectedJson = { name: "Pepito" };

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
