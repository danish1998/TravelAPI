const express = require('express');
const passport = require('../middleware/passport');
const { 
    register, 
    login, 
    logout, 
    getCurrentUser, 
    checkAuthStatus, 
    googleCallback 
} = require('../Controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/ErrorHandler');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/logout', logout);
router.get('/status', asyncHandler(checkAuthStatus));

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/callback?error=oauth_failed' }),
    googleCallback
);

// Protected routes (authentication required)
router.get('/me', verifyToken(), asyncHandler(getCurrentUser));

module.exports = router;
