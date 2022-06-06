require("dotenv").config();
const debug = require("debug")("dishweek:server:middlewares");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization.includes("Bearer ")) {
      throw new Error("Not bearer");
    }
    const token = authorization.replace("Bearer ", "");
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = id;

    debug(chalk.green("Valid token"));

    next();
  } catch (error) {
    error.statusCode = 401;
    error.customMessage = "Invalid token";
    next(error);
  }
};

module.exports = auth;
