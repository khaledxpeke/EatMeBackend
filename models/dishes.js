const Mongoose = require("mongoose");
const DishSchema = new Mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default:
      "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    required: true,
  },
  stars: {
    type: Number,
    default: 5,
    required: true,
  },
  supplements: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'supplement' }]

});

const Dish = Mongoose.model("Dish", DishSchema);
module.exports = Dish;
