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

module.exports = { register, login, logout };
