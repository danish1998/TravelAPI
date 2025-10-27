const User = require("../Models/User");
const { signToken } = require("../middleware/auth");

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "token";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Register new user
const register = async (req, res, next) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            mobile,
            password,
            authProvider: 'local'
        });

        await user.save();

        // Generate JWT token
        const token = signToken({ 
            id: user._id, 
            email: user.email,
            name: user.name 
        });

        // Set JWT cookie
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                authProvider: user.authProvider,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login user
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = signToken({ 
            id: user._id, 
            email: user.email,
            name: user.name 
        });

        // Set JWT cookie
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                authProvider: user.authProvider,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        next(error);
    }
};

// Logout handler (clears cookie)
const logout = async (req, res) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        path: "/",
    });
    res.json({ success: true, message: "Logged out successfully" });
};

// Get current user info
const getCurrentUser = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
                requiresLogin: true
            });
        }

        const user = await User.findById(req.user.id).select('name email mobile authProvider profilePicture googleId');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                requiresLogin: true
            });
        }

        res.json({
            success: true,
            authenticated: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                authProvider: user.authProvider,
                profilePicture: user.profilePicture,
                googleId: user.googleId
            }
        });
    } catch (error) {
        next(error);
    }
};

// Check authentication status (public endpoint)
const checkAuthStatus = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.json({
                success: true,
                authenticated: false,
                message: "User not authenticated",
                requiresLogin: true
            });
        }

        const user = await User.findById(req.user.id).select('name email mobile authProvider profilePicture googleId');
        if (!user) {
            return res.json({
                success: true,
                authenticated: false,
                message: "User not found",
                requiresLogin: true
            });
        }

        res.json({
            success: true,
            authenticated: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                authProvider: user.authProvider,
                profilePicture: user.profilePicture,
                googleId: user.googleId
            }
        });
    } catch (error) {
        next(error);
    }
};

// Google OAuth callback handler
const googleCallback = async (req, res, next) => {
    try {
        console.log('Google OAuth callback - req.user:', req.user);
        
        if (!req.user) {
            console.error('No user found in req.user');
            return res.redirect(`${FRONTEND_URL}/auth/callback?error=no_user`);
        }
        
        const user = req.user;
        
        // Generate JWT token
        const token = signToken({ 
            id: user._id, 
            email: user.email,
            name: user.name 
        });

        console.log('Generated JWT token for user:', user.email);

        // Set JWT cookie
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Redirect to frontend with token
        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
        console.error('Google OAuth callback error:', error);
        res.redirect(`${FRONTEND_URL}/auth/callback?error=oauth_failed`);
    }
};

module.exports = { 
    register, 
    login, 
    logout, 
    getCurrentUser, 
    checkAuthStatus, 
    googleCallback 
};
