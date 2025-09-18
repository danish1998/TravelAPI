const fetch = require("node-fetch"); // skip in Node 18+

const location = async (req, res, next) => {
    try {
        let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

        // Handle localhost / private ranges
        if (
            ip === "::1" || 
            ip === "127.0.0.1" || 
            ip.startsWith("192.168") || 
            ip.startsWith("10.") || 
            ip.startsWith("172.16.")
        ) {
            ip = "103.21.220.50"; // ✅ Delhi IP for local testing
        }

        // Call ip-api first
        let response = await fetch(`http://ip-api.com/json/${ip}`);
        let data = await response.json();

        // If ip-api fails, fallback to ipwho.is
        if (data.status === "fail") {
            response = await fetch(`https://ipwho.is/${ip}`);
            data = await response.json();

            if (!data.success) {
                return res.status(400).json({
                    message: "Unable to fetch location",
                    reason: data.message || "Unknown error"
                });
            }

            return res.json({
                ip,
                latitude: data.latitude,
                longitude: data.longitude,
                area: `${data.city}, ${data.region}, ${data.country}`,
                source: "ipwho.is"
            });
        }

        // Successful ip-api response
        return res.json({
            ip,
            latitude: data.lat,
            longitude: data.lon,
            area: `${data.city}, ${data.regionName}, ${data.country}`,
            source: "ip-api"
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { location };
