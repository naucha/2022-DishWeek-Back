require("dotenv").config();

const express = require("express");
const auth = require("../middlewares/auth");
const { getDishes, deleteDish } = require("../controllers/dishController");

const dishesRouter = express.Router();

dishesRouter.get("/list", auth, getDishes);
dishesRouter.delete("/list/:idDishes", auth, deleteDish);

module.exports = dishesRouter;
