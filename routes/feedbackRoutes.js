const router = require('express').Router();
const { add } = require("../controllers/feedBackController");
const { adminAuth,userAuth } = require("../Middleware/auth")

router.route("/add").post(userAuth,add);


module.exports = router;