const TravelStory = require("../Models/TravelStory");
const { APIError } = require("../middleware/ErrorHandler");
const slugify = require("slugify");

/**
 * GET /api/v1/stories
 * Returns all published travel stories
 */
const getStories = async (req, res) => {
  const { published } = req.query;
  
  const query = {};
  if (published !== undefined) {
    query.published = published === "true";
  }

  const stories = await TravelStory.find(query)
    .sort({ publishedAt: -1 })
    .lean();

  if (!stories || stories.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No stories found",
    });
  }

  return res.json({
    success: true,
    count: stories.length,
    data: stories,
  });
};

/**
 * GET /api/v1/stories/:slug
 * Returns a single travel story by slug
 */
const getStoryBySlug = async (req, res) => {
  const { slug } = req.params;
  
  if (!slug) {
    throw new APIError("Slug parameter is required", 400);
  }

  const story = await TravelStory.findOne({ slug }).lean();

  if (!story) {
    throw new APIError("Story not found", 404);
  }

  return res.json({
    success: true,
    data: story,
  });
};

/**
 * POST /api/v1/stories
 * Creates a new travel story
 */
const createStory = async (req, res) => {
  const {
    title,
    description,
    quote,
    image,
    altText,
    metaTitle,
    metaDescription,
    keywords,
    category,
    readTime,
    published,
  } = req.body;

  if (!title || !description || !image || !metaTitle || !metaDescription) {
    throw new APIError(
      "Title, description, image, metaTitle, and metaDescription are required",
      400
    );
  }

  // Check if story with same slug already exists
  const slug = slugify(title, { lower: true });
  const existing = await TravelStory.findOne({ slug }).lean();
  
  if (existing) {
    throw new APIError("A story with this title already exists", 409);
  }

  const story = await TravelStory.create({
    title,
    description,
    quote: quote || "",
    image,
    altText: altText || "",
    metaTitle,
    metaDescription,
    keywords: Array.isArray(keywords) ? keywords : [],
    category: category || "travel-journey",
    readTime: readTime || 5,
    published: published !== undefined ? published : true,
  });

  return res.status(201).json({
    success: true,
    data: story,
  });
};

/**
 * PUT /api/v1/stories/:slug
 * Updates an existing travel story
 */
const updateStory = async (req, res) => {
  const { slug } = req.params;
  
  if (!slug) {
    throw new APIError("Slug parameter is required", 400);
  }

  const updatePayload = { ...req.body };
  
  // If title is being updated, regenerate slug
  if (updatePayload.title) {
    updatePayload.slug = slugify(updatePayload.title, { lower: true });
  }

  // Remove empty strings to avoid overwriting with empty values
  Object.keys(updatePayload).forEach((key) => {
    if (updatePayload[key] === "") {
      delete updatePayload[key];
    }
  });

  const updated = await TravelStory.findOneAndUpdate(
    { slug },
    updatePayload,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updated) {
    throw new APIError("Story not found", 404);
  }

  return res.json({
    success: true,
    data: updated,
  });
};

/**
 * DELETE /api/v1/stories/:slug
 * Deletes a travel story by slug
 */
const deleteStory = async (req, res) => {
  const { slug } = req.params;
  
  if (!slug) {
    throw new APIError("Slug parameter is required", 400);
  }

  const deleted = await TravelStory.findOneAndDelete({ slug });
  
  if (!deleted) {
    throw new APIError("Story not found", 404);
  }

  return res.json({
    success: true,
    message: "Story deleted successfully",
  });
};

/**
 * POST /api/v1/stories/seed
 * Seeds travel stories from the seed data file
 */
const seedStories = async (req, res) => {
  try {
    const storiesData = require("../data/storiesSeed");

    if (!Array.isArray(storiesData) || storiesData.length === 0) {
      throw new APIError("No seed data found", 400);
    }

    const results = [];

    for (const storyData of storiesData) {
      try {
        // Generate slug from title
        const slug = slugify(storyData.title, { lower: true });

        // Prepare story data with defaults
        // Truncate metaTitle to max 70 characters and metaDescription to max 160
        const metaTitle = storyData.metaTitle || storyData.title;
        const metaDescription =
          storyData.metaDescription ||
          storyData.description.substring(0, 160).trim();

        const storyPayload = {
          title: storyData.title,
          description: storyData.description,
          quote: storyData.quote || "",
          image: storyData.image,
          altText: storyData.altText || "",
          metaTitle: metaTitle.length > 70 ? metaTitle.substring(0, 70).trim() : metaTitle,
          metaDescription:
            metaDescription.length > 160
              ? metaDescription.substring(0, 160).trim()
              : metaDescription,
          keywords: storyData.keywords || [],
          category: storyData.category || "travel-journey",
          readTime: storyData.readTime || 5,
          published: storyData.published !== undefined ? storyData.published : true,
        };

        // Upsert: update if exists, create if not
        const story = await TravelStory.findOneAndUpdate(
          { slug },
          storyPayload,
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        );

        results.push(story);
      } catch (error) {
        console.error(`Error seeding story "${storyData.title}":`, error.message);
        // Continue with next story instead of failing completely
        throw new APIError(
          `Error seeding story "${storyData.title}": ${error.message}`,
          500
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: "Stories seeded successfully",
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  }
};

module.exports = {
  getStories,
  getStoryBySlug,
  createStory,
  updateStory,
  deleteStory,
  seedStories,
};

