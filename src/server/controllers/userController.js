const bcrypt = require("bcrypt");
const User = require("../../database/models/User");

const registerUser = async (req, res, next) => {
  const { name, username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      const encryptedPassword = bcrypt.hash(password, 10);
      const newUser = {
        name,
        username,
        password: encryptedPassword,
      };

      await User.create(newUser);

      res.status(201).json({ name });
    } else {
      const userError = new Error();
      userError.statusCode = 409;
      userError.customMessage = "User name already exist";

      next(userError);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser };
