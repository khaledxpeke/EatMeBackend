const Mongoose = require("mongoose");
const CartSchema = new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      guestId: {
        type: String ,
      },
      dishes: [
        {
          dishId: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'Dish',
          },
          quantity: {
            type: Number,
            default: 1
          }
        }
      ]
});

const Cart = Mongoose.model("cart", CartSchema);
module.exports = Cart;
