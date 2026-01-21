const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const getShortsVideo = async (req, res, next) => {
  try {
    const { city } = req.params;
    const page = Number(req.query.page) || 1;
    const perPage = 18;

    if (!process.env.PEXELS_API_KEY) {
      return res.status(500).json({
        status: "error",
        message: "PEXELS_API_KEY is not configured",
      });
    }

    if (!city || city.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "City parameter is required",
      });
    }

    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(
        city.trim()
      )}&orientation=portrait&per_page=${perPage}&page=${page}`,
      {
        headers: { Authorization: process.env.PEXELS_API_KEY },
      }
    );

    const data = await response.json();

    return res.json({
      status: "success",
      page,
      perPage,
      hasMore: data.videos.length === perPage,
      videos: data.videos,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getShortsVideo,
};
