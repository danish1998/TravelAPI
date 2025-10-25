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
        const email = profile.emails[0].value;
        
        // First, try to find existing user by Google ID
        let user = await this.findOne({ googleId: profile.id });
        
        if (user) {
            return user;
        }
        
        // If not found by Google ID, check if user exists with same email
        user = await this.findOne({ email: email });
        
        if (user) {
            // If user exists but doesn't have Google ID, link it
            if (!user.googleId) {
                user.googleId = profile.id;
                user.authProvider = 'google';
                user.profilePicture = profile.photos[0]?.value;
                await user.save();
            }
            return user;
        }
        
        // Create new user with proper handling of mobile field
        const userData = {
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            profilePicture: profile.photos[0]?.value,
            authProvider: 'google'
        };
        
        // Only set mobile if it's provided (for OAuth users, it's usually null)
        // Don't set mobile field at all for OAuth users to avoid null conflicts
        user = await this.create(userData);
        
        return user;
    } catch (error) {
        console.error('OAuth user creation error:', error);
        throw new Error(`OAuth user creation failed: ${error.message}`);
    }
};

module.exports = mongoose.model("User", userSchema);
