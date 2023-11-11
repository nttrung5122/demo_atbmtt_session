const router = require('express').Router();
const userController    = require("../controllers/userController");
const authMiddleware = require("../middleware/auth.middleware");

// session
router.get("/session",authMiddleware.verify,userController.getAllUsers);
router.delete("/session/:id",authMiddleware.verifyAdminAuth,userController.deleteUser);

module.exports = router;