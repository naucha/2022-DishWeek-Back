require("dotenv").config();
const debug = require("debug")("dishweek:server:controllers:dishController");
const chalk = require("chalk");
const path = require("path");
const Dish = require("../../database/models/Dish");
const User = require("../../database/models/User");

const getDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find({});
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

const createDish = async (req, res, next) => {
  try {
    const dish = req.body;
    const {
      userId: { username },
    } = req;
    const { file } = req;
    const { firebaseFileURL, newFilename } = req;

    const newDish = {
      ...dish,
      createdby: username,
      image: file ? path.join("images", newFilename) : "",
      imagebackup: file ? firebaseFileURL : "",
    };
    debug(newDish);

    const createdDish = await Dish.create(newDish);

    await User.updateOne(
      { username },
      {
        $push: {
          mycreateddishes: createdDish.id,
        },
      }
    );
    debug(createdDish.id);
    debug(chalk.bgBlackBright("Creating new dish"));

    res.status(201).json({ dish: { id: createdDish.id, ...newDish } });
  } catch (error) {
    debug(chalk.bgRedBright("Error creating dish"));
    next(error);
  }
};

module.exports = { getDishes, deleteDish, createDish };
