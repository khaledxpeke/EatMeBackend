const router = require('express').Router();
const { createSupplement,getAllSupplements,getAllSupplementsForDish,deleteSupplementForDish,addExistingSupplementToDish,addSupplement } = require("../controllers/supplementController");
const { adminAuth,userAuth } = require("../Middleware/auth")

router.route("/").post(userAuth,createSupplement);
router.route("/add").post(userAuth,addSupplement);
router.route("/:supplementId").post(userAuth,addExistingSupplementToDish);
router.route("/:dishId").get(userAuth,getAllSupplementsForDish);
router.route("/").get(userAuth,getAllSupplements);
router.route("/:supplementId").delete(userAuth,deleteSupplementForDish);

module.exports = router;