const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/User');

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google OAuth Profile:', {
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value,
            photos: profile.photos?.[0]?.value
        });
        
        if (!profile.emails || !profile.emails[0]) {
            console.error('No email found in Google profile');
            return done(new Error('No email found in Google profile'), null);
        }
        
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
            console.log('Existing Google user found:', user.email);
            // User exists, update profile picture if needed
            if (profile.photos && profile.photos[0] && profile.photos[0].value !== user.profilePicture) {
                user.profilePicture = profile.photos[0].value;
                await user.save();
            }
            return done(null, user);
        }
        
        // Check if user exists with same email (account linking)
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
            console.log('Linking Google account to existing user:', user.email);
            // Link Google account to existing user
            user.googleId = profile.id;
            user.authProvider = 'google';
            if (profile.photos && profile.photos[0]) {
                user.profilePicture = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
        }
        
        // Create new user
        console.log('Creating new Google user:', profile.emails[0].value);
        user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            authProvider: 'google'
        });
        
        await user.save();
        console.log('New Google user created successfully:', user.email);
        return done(null, user);
        
    } catch (error) {
        console.error('Google OAuth Strategy Error:', error);
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
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
