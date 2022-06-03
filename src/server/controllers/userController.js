require("dotenv").config();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../database/models/User");
const { customError } = require("../../utils/customError");

const registerUser = async (req, res, next) => {
  const { name, username, password } = req.body;

  const user = await User.findOne({ username });

  if (user) {
    const userError = new Error();
    userError.statusCode = 409;
    userError.customMessage = "User name already exist";

    next(userError);
    return;
  }

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, username, password: encryptedPassword };

    await User.create(newUser);

    res.status(201).json({ username });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    const error = customError(403, "Bad request", "User or password not valid");

    next(error);
    return;
  }

  const userData = {
    username: user.username,
    password: user.password,
  };

  const rightPassword = await bcrypt.compare(password, user.password);
  if (!rightPassword) {
    const error = customError(403, "Bad request", "User or password not valid");

    next(error);
    return;
  }
  const token = jsonwebtoken.sign(userData, process.env.JWT_SECRET);

  res.status(200).json({ token });
};

module.exports = { registerUser, loginUser };
