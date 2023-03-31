const Mongoose = require("mongoose")
const UserSchema = new Mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  gender: {
    type: String,
  },
  phone: {
    type: String,
    minlength: 8,
  },
  address: {
    type: String,
    minlength: 6,
  },
  date: {
    type: Date,
  },
  country: {
    type: String,
  },
  region: {
    type: String,
  },
  state: {
    type: String,
  },
  postal: {
    type: String,
    minlength: 3,
  },
  image: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  },
})

const User = Mongoose.model("user", UserSchema)
module.exports = User