const router = require('express').Router();
const { add,getFeedback,update,getAll,deleteFeedback } = require("../controllers/feedbackController");
const { adminAuth,userAuth } = require("../Middleware/auth")

router.route("/add").post(userAuth,add);
router.route("/update").post(userAuth,update);
router.route("/").get(userAuth,getAll);
router.route("/:id").get(userAuth,getFeedback);
router.route("/:id").delete(userAuth,deleteFeedback);


module.exports = router;