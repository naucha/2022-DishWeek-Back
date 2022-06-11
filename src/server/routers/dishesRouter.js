require("dotenv").config();

const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middlewares/auth");
const {
  getDishes,
  deleteDish,
  createDish,
} = require("../controllers/dishController");

const dishesRouter = express.Router();

const upload = multer({
  dest: path.join("uploads", "images"),
});

dishesRouter.get("/list", auth, getDishes);
dishesRouter.delete("/:idDishes", deleteDish);
dishesRouter.post("/create", auth, upload.single("image"), createDish);

module.exports = dishesRouter;
