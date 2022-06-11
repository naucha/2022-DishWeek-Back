require("dotenv").config();
const debug = require("debug")("dishweek:server:controllers");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

// const { initializeApp } = require("firebase/app");
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
  const dish = req.body;
  const {
    userId: { username },
  } = req;
  const { file } = req;

  const newFilename = `${Date.now()}${file.original}.jpg`;

  if (file) {
    fs.rename(
      path.join("uploads", "images", file.filename),
      path.join("uploads", "images", newFilename),
      async (error) => {
        if (error) {
          debug(chalk.red(error.message));
          const userError = new Error(error.message);
          userError.statusCode = 500;
          userError.customMessage = "Failed renaming file";

          next(error);
        }
      }
    );

    const newDish = {
      ...dish,
      createdby: username,
      image: path.join("images", newFilename),
      imagebackup: "",
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
  }
};

module.exports = { getDishes, deleteDish, createDish };

// const firebaseConfig = {
//   apiKey: "AIzaSyBI24WNicorKeGc6QmRmgQuBRLhoIm_dZ4",
//   authDomain: "images-3286d.firebaseapp.com",
//   projectId: "images-3286d",
//   storageBucket: "images-3286d.appspot.com",
//   messagingSenderId: "1096893269963",
//   appId: "1:1096893269963:web:fc8c6ee97729bb4362984e",
// };
// const firebaseApp = initializeApp(firebaseConfig);

// fs.readfile(
//   path.join("uploads", "image", newFilename),
//   async(readError, readFile)
// );

// const storage = getStorage(fireBaseApp);
// const storageRef = ref(storage, newFilename);
// await uploadBytes(storageRef, readFile);

// const fireBAseFileURL = await getDownLoad(storageRef);
