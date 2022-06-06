const Dish = require("../../database/models/Dish");
const mockDishes = require("../mocks/mockDishes");
const { getDishes, deleteDish } = require("./dishController");

describe("Given a getDish function", () => {
  describe("When it receives a request", () => {
    test("Then it should call the response's status method with 200", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedStatus = 200;

      Dish.find = jest.fn().mockResolvedValue(mockDishes);

      await getDishes(null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });
});

describe("Given a deleteDish function", () => {
  describe("When it receives a request", () => {
    test("Then is should call the respons's status method with 200 and a json message", async () => {
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const req = { params: { idDishes: "2121" } };
      const expectedStatus = 200;
      const expectedMessage = { msg: "Deleted dish with ID: 2121" };
      Dish.findByIdAndDelete = jest.fn().mockResolvedValue(mockDishes[1]);

      await deleteDish(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
