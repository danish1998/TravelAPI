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

// Debug endpoint to test Google OAuth configuration
router.get('/debug-config', (req, res) => {
    const config = {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'NOT SET',
        FRONTEND_URL: process.env.FRONTEND_URL || 'NOT SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT SET',
        SESSION_SECRET: process.env.SESSION_SECRET ? 'SET' : 'NOT SET',
        MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET'
    };
    
    res.json({
        success: true,
        message: 'Google OAuth Configuration Check',
        config: config
    });
});

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
    passport.authenticate('google', { failureRedirect: '/?error=oauth_failed' }),
    googleCallback
);

// Protected routes (authentication required)
router.get('/me', verifyToken(), asyncHandler(getCurrentUser));

module.exports = router;
