const mongoose = require('mongoose');

const supplementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
  }
});

const Supplement = mongoose.model('Supplement', supplementSchema);

module.exports = Supplement;