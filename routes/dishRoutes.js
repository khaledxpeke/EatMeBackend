const router = require('express').Router();
const { add,getAll,getDish } = require("../controllers/dishController");


router.route("/").post(add);
router.route("/").get(getAll);
router.route("/:id").get(getDish);

module.exports = router;