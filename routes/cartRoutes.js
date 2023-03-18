const router = require('express').Router();
const { createCart,removeDishFromCart,addDishtoCart,clearCart} = require("../controllers/cartController");
const { userAuth } = require("../Middleware/auth")

router.route("/").post(userAuth,createCart);
router.route("/add").post(userAuth,addDishtoCart);
router.route("/:cartId").post(userAuth,clearCart);
router.route("/:cartId").delete(userAuth,removeDishFromCart);

module.exports = router;