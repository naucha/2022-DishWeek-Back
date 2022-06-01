require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const { registerUser } = require("../controllers/userController");
const {
  credentialsRegisterSchema,
  credentialsLoginSchema,
} = require("../schemas/userCredentialsSchema");

const userRouter = express.Router();

userRouter.post("/register", validate(credentialsRegisterSchema), registerUser);
userRouter.post("/login", validate(credentialsLoginSchema), "");
module.exports = userRouter;
