require("dotenv").config();

const express = require("express");
const auth = require("../middlewares/auth");
const { getDishes } = require("../controllers/dishController");

const dishesRouter = express.Router();

dishesRouter.get("/dishes", auth, getDishes);

module.exports = dishesRouter;
