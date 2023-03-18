const Mongoose = require("mongoose");
const OrderedDishSchema = new Mongoose.Schema({
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
      ],
        supplements: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: 'Supplement',
          required: true,
        },

});

const OrderedDish = Mongoose.model("orderedDish", OrderedDishSchema);
module.exports = OrderedDish;
