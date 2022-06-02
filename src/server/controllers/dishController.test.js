const Dish = require("../../database/models/Dish");
const { mockDishes } = require("../mocks/mockDishes");
const { getDishes } = require("./dishController");

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
