const router = require('express').Router();
const { addReservation,getReservation,getAllReservations} = require("../controllers/ReservationController");
const { userAuth } = require("../Middleware/auth")

router.route("/").post(addReservation);
router.route("/").get(getAllReservations);
router.route("/:id").get(getReservation);


module.exports = router;