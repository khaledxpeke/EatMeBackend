const Mongoose = require("mongoose")
const HistorySchema = new Mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  table: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  payment: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  user_id: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
})

const History = Mongoose.model("history", HistorySchema)
module.exports = History