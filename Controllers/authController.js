const User = require("../Models/User");
const { signToken } = require("../middleware/auth");

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "token";

const register = async (req, res, next) => {
    try {
        const { name, email, mobile, password } = req.body;
        if (!email || !mobile || !password) {
            return res.status(400).json({ message: "Email, mobile and password are required" });
        }

        const existing = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existing) {
            return res.status(409).json({ message: "Email or mobile already in use" });
        }

        const passwordHash = await User.hashPassword(password);
        const user = await User.create({ name, email, mobile, passwordHash });

        const token = signToken({ id: user._id, email: user.email });
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({ id: user._id, name: user.name, email: user.email, mobile: user.mobile });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        // If token is already valid (verifyToken with required:false), return current user
        if (req.user && req.user.id) {
            const existing = await User.findById(req.user.id).select("name email mobile");
            if (existing) {
                return res.json({ id: existing._id, name: existing.name, email: existing.email, mobile: existing.mobile });
            }
        }

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const ok = await user.comparePassword(password);
        if (!ok) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = signToken({ id: user._id, email: user.email });
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json({ id: user._id, name: user.name, email: user.email, mobile: user.mobile });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.json({ success: true });
};

// Google OAuth callback handler
const googleCallback = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Google authentication failed"
            });
        }

        const user = req.user;
        const token = signToken({ id: user._id, email: user.email });
        
        // Set JWT cookie
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        // Redirect to frontend home page after successful authentication
        const frontendUrl = process.env.FRONTEND_URL || 'https://www.comfortmytrip.com';
        const redirectUrl = `${frontendUrl}/`;
        
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Google OAuth callback error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'https://www.comfortmytrip.com';
        res.redirect(`${frontendUrl}/?error=${encodeURIComponent(error.message)}`);
    }
};

// Get current user info (for both local and OAuth users)
const getCurrentUser = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
                requiresLogin: true
            });
        }

        const user = await User.findById(req.user.id).select('name email mobile authProvider profilePicture');
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
                profilePicture: user.profilePicture
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

        const user = await User.findById(req.user.id).select('name email mobile authProvider profilePicture');
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
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, logout, googleCallback, getCurrentUser, checkAuthStatus };
