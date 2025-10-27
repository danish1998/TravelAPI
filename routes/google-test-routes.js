const express = require('express');
const router = express.Router();
const axios = require('axios');

// Test Google OAuth token exchange
router.get('/test-google-token-exchange', async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Authorization code is required'
            });
        }
        
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_CALLBACK_URL;
        
        console.log('Testing Google token exchange with:', {
            clientId: clientId ? 'SET' : 'NOT SET',
            clientSecret: clientSecret ? 'SET' : 'NOT SET',
            redirectUri: redirectUri || 'NOT SET',
            code: code.substring(0, 20) + '...'
        });
        
        // Exchange authorization code for access token
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri
        });
        
        console.log('Token exchange successful:', {
            access_token: tokenResponse.data.access_token ? 'SET' : 'NOT SET',
            token_type: tokenResponse.data.token_type,
            expires_in: tokenResponse.data.expires_in
        });
        
        // Get user info from Google
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${tokenResponse.data.access_token}`
            }
        });
        
        console.log('User info retrieved:', {
            id: userResponse.data.id,
            email: userResponse.data.email,
            name: userResponse.data.name
        });
        
        res.json({
            success: true,
            message: 'Google OAuth token exchange successful',
            user: {
                id: userResponse.data.id,
                email: userResponse.data.email,
                name: userResponse.data.name,
                picture: userResponse.data.picture
            }
        });
        
    } catch (error) {
        console.error('Google OAuth test error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Google OAuth token exchange failed',
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;
