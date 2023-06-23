const express = require("express");
const app = express();
const connectDB = require("./db/db");
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./Middleware/auth.js");
app.use(express.json());
const cors = require("cors")
app.use(cors({
  origin: "*",
  credentials: true
}))

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
app.use("/api/reservation", require("./routes/reservationRoutes"))



app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" })
  res.redirect("/")
})
