const Mongoose = require("mongoose");
const ReservationSchema = new Mongoose.Schema({
  PersonNumber: {
    type: Number,
    required: true,
  },
  FullName: {
    type: Number,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  Occasion: {
    type: String,
  },
  SpecialRequest: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  Time: {
    type: String,
    required: true,
  },
  Reminder: {
    type: Boolean,
  },
});

const Reservation = Mongoose.model("Reservation", ReservationSchema);
module.exports = Reservation;
