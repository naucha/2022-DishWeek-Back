const { Schema, model, SchemaTypes } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mycreateddishes: {
    type: [SchemaTypes.ObjectId],
    ref: "Dish",
    default: [],
  },
});

const User = model("User", UserSchema, "users");

module.exports = User;
