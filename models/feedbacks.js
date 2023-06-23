const Mongoose = require("mongoose");
const FeedbackSchema = new Mongoose.Schema({
  description: {
    type: String,
    minlength: 6,
    required: true,
  },
});

const Feedback = Mongoose.model("feedback", FeedbackSchema);
module.exports = Feedback;
