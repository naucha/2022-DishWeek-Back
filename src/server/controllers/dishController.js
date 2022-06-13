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
      body: { ingredient: allIngredients },
    } = req;

    const cleanIngredients = allIngredients
      .split("\r\n")
      .map((ingredient) => ingredient.replace("- ", ""));

    const { file } = req;
    const { firebaseFileURL, newFilename } = req;

    const newDish = {
      ...dish,
      createdby: username,
      image: file ? path.join("images", newFilename) : "",
      imagebackup: file ? firebaseFileURL : "",
      ingredients: cleanIngredients,
    };

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
    const customError = new Error();
    customError.customMessage = "Error creating dish";
    customError.statusCode = 403;

    next(customError);
  }
};

const getDish = async (req, res, next) => {
  const { idDishes } = req.params;

  try {
    const singleDish = await Dish.findById(idDishes);

    res.status(200).json({ singleDish });
  } catch (error) {
    debug(chalk.bgRedBright("Error creating dish"));
    const customError = new Error();
    customError.statusCode = 400;
    customError.customMessage = "Error getting dish";

    next(customError);
  }
};

const updateDish = async (req, res, next) => {
  debug(chalk.bgBlue("New Request to update dish"));
  try {
    const { idDishes } = req.params;
    let dish = req.body;
    const { image, firebaseFileURL } = req;
    if (image) {
      dish = {
        ...dish,
        image,
        imagebackup: firebaseFileURL,
      };
    }

    const updatedDish = await Dish.findByIdAndUpdate(idDishes, dish, {
      new: true,
    });

    res.status(200).json({ updatedDish });
  } catch (error) {
    debug(chalk.bgRed("Error updating dish"));
    const customError = new Error();
    customError.customMessage = "Error updating dish";
    customError.statusCode = 404;

    next(customError);
  }
};

module.exports = {
  getDishes,
  deleteDish,
  createDish,
  updateDish,
  getDish,
};
