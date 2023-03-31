const router = require('express').Router();
const { register,login, getUsers,logout, updatePassword,findEmail,resetPassword,updateProfile,getUserbyId,updateUserImage } = require("../controllers/authController");
const { adminAuth,userAuth } = require("../Middleware/auth")


router.route("/register").post(register)
router.route("/login").post(login);
router.route("/users").get(getUsers);
router.route("/user").get(userAuth,getUserbyId);
router.route("/logout").post(logout);
router.route("/updatePass").post(userAuth,updatePassword);
router.route("/findemail").get(findEmail);
router.route("/resetPass").post(resetPassword);
router.route("/update").post(userAuth,updateProfile);
router.route("/updateImage").post(userAuth,updateUserImage);
//router.route("/update").put(adminAuth, update)
//router.route("/deleteUser").delete(adminAuth, deleteUser)





module.exports = router;
