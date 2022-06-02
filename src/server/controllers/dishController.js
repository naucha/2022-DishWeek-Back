require("dotenv").config();
const debug = require("debug")("dishweek:server:controllers");
const chalk = require("chalk");
const Dish = require("../../database/models/Dish");

const getDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find();
    debug(chalk.green("Getting Dishes"));

    res.status(200).json(dishes);
  } catch (error) {
    const userError = new Error();
    userError.statusCode = 404;
    userError.customMessage = "Page Not Found";

    next(userError);
  }
};

module.exports = { getDishes };
