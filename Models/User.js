const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        mobile: { type: String, trim: true }, // Made optional for OAuth users
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
        // First, try to find existing user by Google ID
        let user = await this.findOne({ googleId: profile.id });
        
        if (user) {
            return user;
        }
        
        // If not found by Google ID, check if user exists with same email
        user = await this.findOne({ email: profile.emails[0].value });
        
        if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.authProvider = 'google';
            user.profilePicture = profile.photos[0]?.value;
            await user.save();
            return user;
        }
        
        // Create new user
        user = await this.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePicture: profile.photos[0]?.value,
            authProvider: 'google'
        });
        
        return user;
    } catch (error) {
        throw new Error(`OAuth user creation failed: ${error.message}`);
    }
};

module.exports = mongoose.model("User", userSchema);
