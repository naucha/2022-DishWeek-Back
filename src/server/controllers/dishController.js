require("dotenv").config();
const debug = require("debug")("dishweek:server:controllers");
const chalk = require("chalk");
const Dish = require("../../database/models/Dish");
const User = require("../../database/models/User");

const getDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find().populate({
      path: "dishes",
      select: "name username",
      model: User,
    });
    debug(chalk.green("Getting Dishes"));

    res.status(200).json(dishes);
  } catch (error) {
    const userError = new Error();
    userError.statusCode = 404;
    userError.customMessage = "Page Not Found";

    next(userError);
  }
};

const deleteDish = async (req, res) => {
  const { idDishes } = req.params;

  debug(chalk.bgBlue("New Request to delete a dish"));

  await Dish.findByIdAndDelete(idDishes);

  res.status(200).json({ msg: `Deleted dish with ID: ${idDishes}` });
};

module.exports = { getDishes, deleteDish };
