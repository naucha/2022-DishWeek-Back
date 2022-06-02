require("dotenv").config();
const debug = require("debug")("dishweek:server:controllers");
const chalk = require("chalk");
const Dish = require("../../database/models/Dish");

const getDish = async (req, res, next) => {
  try {
    const dishes = await Dish.find();
    debug(chalk.green("Getting Dishes"));
    res.status(200).json(dishes);
  } catch (error) {
    error.statusCode = 404;
    error.customMessage = "Not found";
    next(error);
  }
};

module.exports = { getDish };
