const router = require('express').Router();
const authController    = require("../controllers/authController");


router.post('/register-session',authController.registerUser );
router.post('/login-session',authController.logIn );
router.post('/logout-session',authController.logOut );


module.exports = router;
