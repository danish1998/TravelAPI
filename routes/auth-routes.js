const express = require("express");
const passport = require("../middleware/passport");
const { register, login, logout, googleCallback, getCurrentUser } = require("../Controllers/authController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Local authentication routes
router.post("/register", register);
// If a valid token cookie already exists, login returns the current user
router.post("/login", verifyToken({ required: false }), login);
router.get("/logout", logout);

// Google OAuth routes
router.get("/google", passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get("/google/callback", 
    passport.authenticate('google', { failureRedirect: '/' }),
    googleCallback
);

// Get current user info
router.get("/me", verifyToken(), getCurrentUser);

module.exports = router;
