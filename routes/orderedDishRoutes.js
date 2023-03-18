const router = require('express').Router();
const { addDishtoCart,getOrderedDishes,updateOrderedDishSupplements,deleteOrderedDish} = require("../controllers/orderedDishController");
const { userAuth } = require("../Middleware/auth")

router.route("/").post(userAuth,addDishtoCart);
router.route("/add").post(userAuth,addDishtoCart);
router.route("/").get(userAuth,getOrderedDishes);
router.route("/").patch(userAuth,updateOrderedDishSupplements);
router.route("/:id").delete(userAuth,deleteOrderedDish);

module.exports = router;