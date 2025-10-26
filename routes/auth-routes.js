const express = require("express");
const passport = require("../middleware/passport");
const { register, login, logout, googleCallback, getCurrentUser, checkAuthStatus } = require("../Controllers/authController");
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
    passport.authenticate('google', { 
        failureRedirect: 'https://www.comfortmytrip.com/?error=auth_failed',
        session: false 
    }),
    googleCallback
);

// Get current user info (requires authentication)
router.get("/me", verifyToken(), getCurrentUser);

// Check authentication status (public endpoint - doesn't require authentication)
router.get("/status", verifyToken({ required: false }), checkAuthStatus);

module.exports = router;
