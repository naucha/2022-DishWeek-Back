require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const { registerUser, LoginUser } = require("../controllers/userController");
const {
  credentialsRegisterSchema,
  credentialsLoginSchema,
} = require("../schemas/userCredentialsSchema");

const userRouter = express.Router();

userRouter.post("/register", validate(credentialsRegisterSchema), registerUser);
userRouter.post("/login", validate(credentialsLoginSchema), LoginUser);
module.exports = userRouter;
