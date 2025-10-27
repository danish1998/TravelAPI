const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String }, // Optional for OAuth users
        mobile: { type: String, trim: true },
        profilePicture: { type: String }, // Profile picture URL
        googleId: { type: String, unique: true, sparse: true }, // Google OAuth ID
        authProvider: { 
            type: String, 
            enum: ['local', 'google'], 
            default: 'local' 
        }, // Track authentication method
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
