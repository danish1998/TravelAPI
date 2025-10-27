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
        console.log('Google OAuth Profile:', {
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0]?.value,
            photo: profile.photos[0]?.value
        });

        const user = await User.findOrCreateOAuthUser(profile);
        return done(null, user);
    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('-passwordHash');
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
