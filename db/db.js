const mongoose = require("mongoose");

const localDB = "mongodb+srv://khaledbouajila5481:test123@cluster0.4rettyx.mongodb.net/eatme";
const connectDB = async () => {
  await mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected")
}
module.exports = connectDB