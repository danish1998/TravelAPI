const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/User');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '1017864146115-6uq898gljoc2be49ue77504ijv8v0kt3.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://travelapi-r7bq.onrender.com/api/v1/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('=== Passport OAuth Strategy Started ===');
        console.log('Google OAuth Profile ID:', profile.id);
        console.log('Google OAuth Email:', profile.emails?.[0]?.value);
        console.log('Google OAuth Name:', profile.displayName);
        console.log('Environment check:');
        console.log('- GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');
        console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
        console.log('===========================');
        
        if (!profile.emails || profile.emails.length === 0) {
            throw new Error('No email provided by Google');
        }

        const user = await User.findOrCreateOAuthUser(profile);
        console.log('✅ User process completed:', { id: user._id, email: user.email });
        return done(null, user);
    } catch (error) {
        console.error('❌ Google OAuth Strategy Error:', error.message);
        console.error('Error details:', {
            name: error.name,
            code: error.code,
            stack: error.stack
        });
        return done(error, null);
    }
}));

// Note: Not using session serialization since we're using JWT tokens
// passport.serializeUser and passport.deserializeUser are not needed for JWT authentication

module.exports = passport;
