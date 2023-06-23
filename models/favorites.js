const Mongoose = require("mongoose");
const FavoriteSchema = new Mongoose.Schema({
    dish: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        required: true
      },
      user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
});

const Favorite = Mongoose.model("favorite", FavoriteSchema);
module.exports = Favorite;
