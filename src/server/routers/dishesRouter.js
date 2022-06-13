require("dotenv").config();

const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middlewares/auth");
const {
  getDishes,
  deleteDish,
  createDish,
  getDish,
  updateDish,
} = require("../controllers/dishController");
const { renameFile } = require("../middlewares/renameFile");

const dishesRouter = express.Router();

const maxSize = 10000000;
const upload = multer({
  dest: path.join("uploads", "images"),
  limits: {
    fileSize: maxSize,
  },
});

dishesRouter.get("/list", auth, getDishes);
dishesRouter.delete("/:idDishes", deleteDish);
dishesRouter.post(
  "/create",
  auth,
  upload.single("image"),
  renameFile,
  createDish
);

dishesRouter.patch(
  "/edit/:idDishes",
  auth,
  upload.single("image"),
  renameFile,
  updateDish
);

dishesRouter.get("/:idDishes", getDish);

module.exports = dishesRouter;
