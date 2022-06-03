const { Schema, model } = require("mongoose");

const DishSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  veggy: {
    type: Boolean,
    required: true,
  },
  ingredients: {
    type: Array,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  recipe: {
    type: String,
    required: true,
  },
  cookingTime: {
    type: String,
    required: true,
  },
  daysOfWeek: {
    type: Array,
    required: true,
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
