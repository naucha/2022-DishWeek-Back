require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const { getDish } = require("../controllers/dishController");
const { registerUser, LoginUser } = require("../controllers/userController");
const auth = require("../middlewares/auth");
const {
  credentialsRegisterSchema,
  credentialsLoginSchema,
} = require("../schemas/userCredentialsSchema");

const userRouter = express.Router();

userRouter.post("/register", validate(credentialsRegisterSchema), registerUser);
userRouter.post("/login", validate(credentialsLoginSchema), LoginUser);

userRouter.get("/home", auth, getDish);

module.exports = userRouter;
