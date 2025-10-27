const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        mobile: { type: String, trim: true, sparse: true }, // Made sparse to allow multiple null values
        passwordHash: { type: String }, // Made optional for OAuth users
        googleId: { type: String, unique: true, sparse: true }, // Google OAuth ID
        profilePicture: { type: String }, // Profile picture URL from Google
        authProvider: { 
            type: String, 
            enum: ['local', 'google'], 
            default: 'local' 
        }, // Track authentication method
    },
    { timestamps: true }
);

userSchema.methods.comparePassword = async function (plainPassword) {
    // Only compare password for local auth users
    if (this.authProvider !== 'local' || !this.passwordHash) {
        return false;
    }
    return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.statics.hashPassword = async function (plainPassword) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainPassword, salt);
};

// Method to find or create OAuth user
userSchema.statics.findOrCreateOAuthUser = async function (profile) {
    try {
        console.log('🔍 Starting findOrCreateOAuthUser');
        console.log('Profile:', JSON.stringify(profile, null, 2));
        
        // Validate profile data
        if (!profile.emails || profile.emails.length === 0) {
            throw new Error('No email provided in Google profile');
        }
        
        const email = profile.emails[0].value;
        const googleId = profile.id;
        
        console.log(`📧 Email: ${email}, Google ID: ${googleId}`);
        
        // First, try to find existing user by Google ID
        let user = await this.findOne({ googleId: googleId });
        
        if (user) {
            console.log('✅ Found existing user by Google ID:', user._id);
            return user;
        }
        
        console.log('🔍 No user found by Google ID, checking email...');
        
        // If not found by Google ID, check if user exists with same email
        user = await this.findOne({ email: email });
        
        if (user) {
            console.log('✅ Found existing user by email:', user._id);
            
            // If user exists but doesn't have Google ID, link it
            if (!user.googleId) {
                console.log('🔗 Linking Google ID to existing user');
                user.googleId = googleId;
                user.authProvider = 'google';
                user.profilePicture = profile.photos?.[0]?.value;
                await user.save();
                console.log('✅ User updated with Google credentials');
            }
            return user;
        }
        
        console.log('🆕 Creating new user...');
        
        // Create new user
        const userData = {
            name: profile.displayName || 'Google User',
            email: email,
            googleId: googleId,
            profilePicture: profile.photos?.[0]?.value,
            authProvider: 'google'
        };
        
        console.log('User data to create:', userData);
        
        user = await this.create(userData);
        
        console.log('✅ New user created successfully:', user._id);
        return user;
        
    } catch (error) {
        console.error('❌ OAuth user creation error:', error);
        console.error('Error name:', error.name);
        console.error('Error code:', error.code);
        console.error('Error stack:', error.stack);
        
        // Handle duplicate key errors specifically
        if (error.code === 11000) {
            console.error('Duplicate key error details:', error.keyPattern, error.keyValue);
            throw new Error(`User already exists: ${JSON.stringify(error.keyValue)}`);
        }
        
        throw new Error(`OAuth user creation failed: ${error.message}`);
    }
};

module.exports = mongoose.model("User", userSchema);
