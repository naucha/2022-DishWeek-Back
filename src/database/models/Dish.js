const { Schema, model } = require("mongoose");

const DishSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  veggy: {
    type: Boolean,
  },
  ingredients: {
    type: Array,
  },
  image: {
    type: String,
  },
  resume: {
    type: String,
  },
  recipe: {
    type: String,
  },
  cookingTime: {
    type: String,
  },
});

const Dish = model("Dish", DishSchema, "dishes");

module.exports = Dish;

// - Name (string)
// - Veggy (Boolean)
// - Ingredients (string)
// - Image (string)
// - Recipe (object):
// - Resume description (string)
// - Description (string)
// - Cooking Time (string)
