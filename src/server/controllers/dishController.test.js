const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");

const Dish = require("../../database/models/Dish");
const mockDishes = require("../mocks/mockDishes");
const {
  getDishes,
  deleteDish,
  createDish,
  getDish,
} = require("./dishController");
const connectDB = require("../../database");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});
beforeEach(async () => {
  await Dish.create(mockDishes[0]);
  await Dish.create(mockDishes[1]);
});

afterEach(async () => {
  await Dish.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe.skip("Given a getDishes function", () => {
  describe("When it receives a request", () => {
    test("Then it should call the response's status method with 200", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const dishMock = [{ id: "1212", name: "macarrones" }];

      Dish.find = jest.fn().mockResolvedValue(dishMock);
      const expectedStatus = 200;

      await getDishes(null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(dishMock);
    });
  });
});

describe.skip("When occurs an error", () => {
  test("Then it should call the response's method with 404 and 'Page Not Found' error message", async () => {
    const expectedErrorMessage = "Page Not Found";
    const expectedError = new Error(expectedErrorMessage);
    const next = jest.fn();

    Dish.find = jest.fn().mockResolvedValue(false);
    await getDishes(null, null, next);

    expect(next).not.toHaveBeenCalledWith(expectedError);
  });
});

describe.skip("Given a deleteDish function", () => {
  describe("When it receives a request", () => {
    test("Then is should call the respons's status method with 200 and a json message", async () => {
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const req = { params: { idDishes: "2121" } };
      Dish.findByIdAndDelete = jest.fn().mockResolvedValue(mockDishes[0]);

      const expectedMessage = { msg: "Deleted dish with ID: 2121" };

      await deleteDish(req, res);
      const expectedStatus = 200;

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});

describe.skip("Given a createDish function", () => {
  jest.mock("../../database/models/Dish", () => ({
    find: jest.fn().mockReturnThis(),
  }));

  jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    rename: jest.fn().mockReturnValue("pesols386.png"),
  }));

  describe("When it receives a request with a newDish without name", () => {
    test("Then it should call a response's status with 403 and call next function", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const req = {
        body: {
          userId: { username: "Pepito Grillo" },
        },
      };

      const next = jest.fn();
      await createDish(req, res, next);

      const expectedError = new Error();
      expectedError.customMessage = "Error creating dish";
      expectedError.statusCode = 403;

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe.skip("Given a getDish function", () => {
  describe("When it receives a request with a dishId", () => {
    test("Then then should call a response's status method with 200 and json with the requested dish", async () => {
      const expectedStatus = 200;
      const expectedDish = mockDishes[0];

      const req = {
        params: { idDishes: expectedDish.id },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Dish.findById = jest.fn().mockResolvedValue(expectedDish);

      await getDish(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ singleDish: expectedDish });
    });
  });

  describe("When it receives an unknown id", () => {
    test("Then it should call the next function", async () => {
      const req = {
        params: { idDishes: "unknown" },
      };
      const next = jest.fn();

      Dish.findById = jest
        .fn()
        .mockResolvedValue(new Error("Error getting dish"));

      await getDish(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given updateDish fucntion", () => {
  describe("When it receives and id of dish", () => {
    test("Then it shold call a respons method with status 200 and json response with a updated dish", async () => {});
  });
});
