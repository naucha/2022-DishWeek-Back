require("dotenv").config();
const debug = require("debug")();
const chalk = require("chalk");
const Dish = require("../../database/models/Dish");

const getDish = async (req, res, next) => {
  debug(chalk.green("Getting solitary Dish"));
  const dishes = await Dish.find();

  res.status(200).json(dishes);
};

module.exports = getDish;
