const mongoose = require("mongoose");
const OrderedDishSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      guestId: {
        type: String ,
      },
      dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        required: true
      },
      supplements: [{
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
      description: {
        type: String,
        required: true
      }
    }, {
      timestamps: true
    });


const OrderedDish = mongoose.model("orderedDish", OrderedDishSchema);
module.exports = OrderedDish;
