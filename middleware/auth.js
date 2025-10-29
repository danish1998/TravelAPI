const jwt = require("jsonwebtoken");

// Reads JWT from cookie named "token" by default (iOS WebKit compatible)
const getTokenFromCookies = (req, cookieName = "token") => {
    if (!req || !req.cookies) return null;
    
    // Try primary cookie first
    let token = req.cookies[cookieName];
    if (token && typeof token === "string" && token.length > 0) {
        return token;
    }
    
    // Try iOS fallback cookies
    const iosToken = req.cookies[`${cookieName}_ios`];
    if (iosToken && typeof iosToken === "string" && iosToken.length > 0) {
        return iosToken;
    }
    
    const altToken = req.cookies[`${cookieName}_alt`];
    if (altToken && typeof altToken === "string" && altToken.length > 0) {
        return altToken;
    }
    
    return null;
};

// Verify middleware: attaches decoded payload to req.user if valid
const verifyToken = (options = {}) => {
    const {
        cookieName = process.env.JWT_COOKIE_NAME || "token",
        required = true,
        algorithms = [process.env.JWT_ALG || "HS256"],
    } = options;

    return (req, res, next) => {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                return res.status(500).json({
                    status: "error",
                    message: "Server misconfiguration: missing JWT secret",
                });
            }

            // 1) Try cookie-based token (primary)
            let token = getTokenFromCookies(req, cookieName);

            // 2) Fallback: Try Authorization header (Bearer <token>) to support iOS when cookies fail
            if (!token && req.headers && typeof req.headers.authorization === 'string') {
                const authHeader = req.headers.authorization;
                if (authHeader.toLowerCase().startsWith('bearer ')) {
                    token = authHeader.slice(7).trim();
                }
            }

            if (!token) {
                if (required) {
                    return res.status(401).json({
                        status: "error",
                        message: "Authentication token missing",
                    });
                }
                req.user = null;
                return next();
            }

            const decoded = jwt.verify(token, secret, { algorithms });
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired token",
            });
        }
    };
};

// Helper to sign tokens in login handlers
const signToken = (payload, options = {}) => {
    const secret = process.env.JWT_SECRET;
    const {
        expiresIn = process.env.JWT_EXPIRES_IN || "1d",
        algorithm = process.env.JWT_ALG || "HS256",
    } = options;
    return jwt.sign(payload, secret, { expiresIn, algorithm });
};

module.exports = { verifyToken, signToken };
