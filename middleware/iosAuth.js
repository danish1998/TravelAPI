const { signToken, verifyToken } = require("../middleware/auth");

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "token";

// iOS WebKit compatible cookie setting
const setIOSCompatibleCookies = (res, token) => {
    const baseOptions = {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: "/",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    };

    // Primary cookie (httpOnly for security)
    res.cookie(COOKIE_NAME, token, {
        ...baseOptions,
        httpOnly: true
    });

    // iOS WebKit fallback cookie (non-httpOnly for JS access)
    res.cookie(`${COOKIE_NAME}_ios`, token, {
        ...baseOptions,
        httpOnly: false
    });

    // Additional iOS compatibility cookie with different path
    res.cookie(`${COOKIE_NAME}_alt`, token, {
        ...baseOptions,
        httpOnly: false,
        path: "/api" // Different path for iOS WebKit
    });
};

// iOS WebKit compatible cookie clearing
const clearIOSCompatibleCookies = (res) => {
    const baseOptions = {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: "/"
    };

    // Clear all cookie variations
    res.clearCookie(COOKIE_NAME, { ...baseOptions, httpOnly: true });
    res.clearCookie(`${COOKIE_NAME}_ios`, { ...baseOptions, httpOnly: false });
    res.clearCookie(`${COOKIE_NAME}_alt`, { ...baseOptions, httpOnly: false, path: "/api" });
    
    // Additional iOS-specific clearing attempts
    res.clearCookie(COOKIE_NAME, { ...baseOptions, httpOnly: true, path: "/api" });
    res.clearCookie(`${COOKIE_NAME}_ios`, { ...baseOptions, httpOnly: false, path: "/api" });
};

// Enhanced token verification for iOS
const verifyIOSCompatibleToken = (req, res, next) => {
    // Try to get token from multiple sources (iOS WebKit compatibility)
    let token = null;
    
    // 1. Try httpOnly cookie
    if (req.cookies && req.cookies[COOKIE_NAME]) {
        token = req.cookies[COOKIE_NAME];
    }
    // 2. Try iOS fallback cookie
    else if (req.cookies && req.cookies[`${COOKIE_NAME}_ios`]) {
        token = req.cookies[`${COOKIE_NAME}_ios`];
    }
    // 3. Try alternative path cookie
    else if (req.cookies && req.cookies[`${COOKIE_NAME}_alt`]) {
        token = req.cookies[`${COOKIE_NAME}_alt`];
    }
    // 4. Try Authorization header (fallback)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.substring(7);
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No authentication token found",
            requiresLogin: true
        });
    }

    try {
        const decoded = verifyToken()(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid authentication token",
            requiresLogin: true
        });
    }
};

module.exports = {
    setIOSCompatibleCookies,
    clearIOSCompatibleCookies,
    verifyIOSCompatibleToken
};
