const { Schema, model } = require("mongoose");

const DishSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  veggie: {
    type: String,
  },
  ingredients: {
    type: String,
  },
  image: {
    type: String,
  },
  imagebackup: {
    type: String,
  },
  resume: {
    type: String,
  },
  recipe: {
    type: String,
  },
  cookingtime: {
    type: String,
  },
  daysofweek: {
    type: Array,
  },
  createdby: {
    type: String,
  },
});

const Dish = model("Dish", DishSchema, "dishes");

module.exports = Dish;
