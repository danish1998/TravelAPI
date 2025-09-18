const express = require("express");
const { register, login, logout } = require("../Controllers/authController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
// If a valid token cookie already exists, login returns the current user
router.post("/login", verifyToken({ required: false }), login);
router.get("/logout", logout);

module.exports = router;
