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
  cookingtime: {
    type: String,
    required: true,
  },
  daysofweek: {
    type: Array,
    required: true,
  },
});

const Dish = model("Dish", DishSchema, "dishes");

module.exports = Dish;
