import fetch from "node-fetch"; // if you're using Node 18+, you can skip this import

const location = async (req, res, next) => {
    try {
        // Get user's IP (fallback if behind proxy)
        const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

        // Fetch location data from ip-api
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();

        if (data.status === "fail") {
            return res.status(400).json({ message: "Unable to fetch location", reason: data.message });
        }

        return res.json({
            ip: ip,
            latitude: data.lat,
            longitude: data.lon,
            area: `${data.city}, ${data.regionName}, ${data.country}`,
        });
    } catch (err) {
        next(err);
    }
};

export default location;
