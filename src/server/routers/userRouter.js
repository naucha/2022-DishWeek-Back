require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const { registerUser } = require("../controllers/userController");
const {
  credentialsRegisterSchema,
} = require("../schemas/userCredentialsSchema");

const userRouter = express.Router();

userRouter.post("/register", validate(credentialsRegisterSchema), registerUser);

module.exports = userRouter;
