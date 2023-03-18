const router = require('express').Router();
const { add,get,getHistory} = require("../controllers/historyController");
const { userAuth } = require("../Middleware/auth")

router.route("/").post(userAuth,add);
router.route("/").get(userAuth,get);
router.route("/:historyId").get(userAuth,getHistory);

module.exports = router;