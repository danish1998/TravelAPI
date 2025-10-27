const express = require('express');
const router = express.Router();

// Test endpoint to check Google OAuth configuration
router.get('/test-google-config', (req, res) => {
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

module.exports = router;
