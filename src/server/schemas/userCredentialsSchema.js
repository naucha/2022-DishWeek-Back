const { Joi } = require("express-validation");

const credentialsRegisterSchema = {
  body: Joi.object({
    name: Joi.string()
      .max(20)
      .message({ message: "Name is required" })
      .required(),
    username: Joi.string()
      .max(20)
      .message({ message: "Username is required" })
      .required(),
    password: Joi.string()
      .max(16)
      .message({ message: "Password is required" })
      .required(),
  }),
};

module.exports = { credentialsRegisterSchema };
