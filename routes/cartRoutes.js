const router = require('express').Router();
const { createCart,removeDishFromCart,addDishtoCart,getOrderedDishesFromCart} = require("../controllers/cartController");
const { userAuth } = require("../Middleware/auth")

router.route("/").post(userAuth,createCart);
router.route("/").get(userAuth,getOrderedDishesFromCart);
router.route("/add").post(userAuth,addDishtoCart);
router.route("/:itemId").delete(userAuth,removeDishFromCart);

module.exports = router;