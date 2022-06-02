const jwt = require("jsonwebtoken");
const auth = require("./auth");

describe("Given an auth middleware function", () => {
  describe("When it receives a request with a valid token", () => {
    test("Thent it should call a next function error", () => {
      jwt.verify = jest.fn().mockReturnValue(true);
      const req = {
        headers: { authorization: "Bearer " },
      };
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
