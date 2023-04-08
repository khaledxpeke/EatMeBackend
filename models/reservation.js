const Mongoose = require("mongoose");
const ReservationSchema = new Mongoose.Schema({
  people: {
    type: Number,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  occasion: {
    type: String,
  },
  specialRequest: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  reminder: {
    type: Boolean,
  },
});

const Reservation = Mongoose.model("Reservation", ReservationSchema);
module.exports = Reservation;
