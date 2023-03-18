const mongoose = require("mongoose");
const cartItemSchema = new mongoose.Schema({
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
    required: true
  },
  selectedSupplements: [{
    supplement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplement',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
}, {
  timestamps: true
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest'
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

const Cart = mongoose.model("cart", CartSchema);
module.exports = Cart;
