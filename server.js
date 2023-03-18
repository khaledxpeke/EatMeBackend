const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const authRoutes= require("./routes/authRoutes");
const dishRoutes= require("./routes/dishRoutes");
const feedBackRoutes= require("./routes/feedbackRoutes");
const historyRoutes= require("./routes/historyRoutes");
const favoriteRoutes= require("./routes/favoriteRoutes");
const supplementRoutes= require("./routes/supplementRoutes");
const cartRoutes= require("./routes/cartRoutes");
const connectDB = require("./db/db");
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./Middleware/auth.js");
app.use(express.json());
const cors = require("cors")


connectDB();
server = app.listen(3300, function () {
  console.log("Server is listening on port 3300");
});
app.use(cookieParser());
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/dish", require("./routes/dishRoutes"))
app.use("/api/feedbacks", require("./routes/feedbackRoutes"))
app.use("/api/history", require("./routes/historyRoutes"))
app.use("/api/favorite", require("./routes/favoriteRoutes"))
app.use("/api/supplement", require("./routes/supplementRoutes"))
app.use("/api/cart", require("./routes/cartRoutes"))
app.use(authRoutes);
app.use(dishRoutes);
app.use(feedBackRoutes);
app.use(historyRoutes);
app.use(favoriteRoutes);
app.use(supplementRoutes);
app.use(cartRoutes);
app.use(cors({
  origin: "*",
  credentials: true
}))

app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" })
  res.redirect("/")
})
