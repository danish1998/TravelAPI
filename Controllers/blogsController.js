const Blogs = require("../Models/Blogs");
const { APIError } = require("../middleware/ErrorHandler");
const { Readable } = require("stream");
const csvParser = require("csv-parser");

/**
 * GET /api/v1/blogs
 * Returns every blog collection (category + embedded blogs)
 */
const getBlogs = async (req, res) => {
  const blogCollections = await Blogs.find().lean();

  if (!blogCollections || blogCollections.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No blogs found",
    });
  }

  return res.json({
    success: true,
    data: blogCollections,
  });
};

/**
 * POST /api/v1/blogs
 * Creates a new blog collection (category) with optional embedded blogs
 */
const createBlogCollection = async (req, res) => {
  const { name, slug, description, blogs = [] } = req.body;

  if (!name || !slug) {
    throw new APIError("Both name and slug are required", 400);
  }

  const existing = await Blogs.findOne({ slug }).lean();
  if (existing) {
    throw new APIError("Slug already exists", 409);
  }

  const created = await Blogs.create({
    name,
    slug,
    description: description ?? null,
    blogs,
  });

  return res.status(201).json({
    success: true,
    data: created,
  });
};


/**
 * GET /api/v1/blogs/:slug
 * Returns a single blog collection by slug
 */
const getBlogBySlug = async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new APIError("Slug param is required", 400);
  }

  // Find collection that contains a blog with this slug
  const collection = await Blogs.findOne({ "blogs.slug": slug }).lean();

  if (!collection) {
    throw new APIError("Blog not found", 404);
  }

  const blog = collection.blogs.find((b) => b.slug === slug);

  if (!blog) {
    throw new APIError("Blog not found", 404);
  }

  return res.json({
    success: true,
    data: {
      // optional: send both collection + blog
      collection: {
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
      },
      blog,
    },
  });
};

  

/**
 * PUT /api/v1/blogs/:slug
 * Updates an existing blog collection identified by slug
 */
const updateBlogCollection = async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new APIError("Slug param is required", 400);
  }

  const updatePayload = { ...req.body };
  // Avoid slug overwrite with empty values
  if (updatePayload.slug === "") {
    delete updatePayload.slug;
  }

  const updated = await Blogs.findOneAndUpdate({ slug }, updatePayload, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new APIError("Blog collection not found", 404);
  }

  return res.json({
    success: true,
    data: updated,
  });
};

/**
 * DELETE /api/v1/blogs/:slug
 * Removes a blog collection by slug
 */
const deleteBlogCollection = async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new APIError("Slug param is required", 400);
  }

  const deleted = await Blogs.findOneAndDelete({ slug });
  if (!deleted) {
    throw new APIError("Blog collection not found", 404);
  }

  return res.json({
    success: true,
    message: "Blog collection deleted",
  });
};

/**
 * POST /api/v1/blogs/seed
 * Seeds or updates blogs collection from data provided in the request body
 * The endpoint accepts:
 *  - JSON body (array or { collections: [] })
 *  - multipart/form-data with a `file` field (JSON or CSV)
 *  - JSON body containing `json` or `csv` string payloads
 */
const seedBlogs = async (req, res) => {
  const payload = await resolveSeedPayload(req);

  if (!Array.isArray(payload) || payload.length === 0) {
    throw new APIError("Seed payload must contain at least one collection", 400);
  }

  const normalizedCollections = payload.map(normalizeCollection);
  const results = [];

  for (const collection of normalizedCollections) {
    const updated = await Blogs.findOneAndUpdate(
      { slug: collection.slug },
      {
        $set: {
          name: collection.name,
          description: collection.description ?? null,
          blogs: collection.blogs,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );
    results.push(updated);
  }

  return res.status(201).json({
    success: true,
    message: "Blogs seeded / updated successfully",
    count: results.length,
    data: results,
  });
};

/**
 * Determines how the seed payload was provided (file upload, JSON, CSV string, etc.)
 * and normalizes it to an array of collections.
 */
const resolveSeedPayload = async (req) => {
  // File upload via multipart/form-data
  if (req.file) {
    const fileContents = req.file.buffer.toString("utf-8");
    const mimetype = req.file.mimetype || "";
    const originalName = req.file.originalname || "";

    if (mimetype.includes("json") || originalName.endsWith(".json")) {
      return parseJsonPayload(fileContents);
    }

    if (mimetype.includes("csv") || originalName.endsWith(".csv")) {
      return parseCsvPayload(fileContents);
    }

    throw new APIError(
      `Unsupported file type "${mimetype}". Please upload JSON or CSV.`,
      400
    );
  }

  // Raw JSON array body
  if (Array.isArray(req.body) && req.body.length > 0) {
    return req.body;
  }

  // Body contains { collections: [...] }
  if (req.body && Array.isArray(req.body.collections)) {
    return req.body.collections;
  }

  // Body contains JSON string
  if (req.body && typeof req.body.json === "string") {
    return parseJsonPayload(req.body.json);
  }

  // Body contains CSV string
  if (req.body && typeof req.body.csv === "string") {
    return parseCsvPayload(req.body.csv);
  }

  // Body is a string (raw JSON or CSV)
  if (req.body && typeof req.body === "string") {
    return parseUnknownStringPayload(req.body);
  }

  // Body is a single object representing one collection
  if (req.body && Object.keys(req.body).length > 0) {
    return [req.body];
  }

  throw new APIError(
    "No seed data found. Send an array of collections, or upload a JSON/CSV file via `file` field.",
    400
  );
};

const parseJsonPayload = (rawString) => {
  try {
    const parsed = JSON.parse(rawString);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed && Array.isArray(parsed.collections)) {
      return parsed.collections;
    }
    throw new Error("JSON payload must be an array or { collections: [] }");
  } catch (error) {
    throw new APIError(`Invalid JSON payload: ${error.message}`, 400);
  }
};

const parseCsvPayload = (csvString) =>
  new Promise((resolve, reject) => {
    const rows = [];
    Readable.from(csvString)
      .pipe(
        csvParser({
          mapHeaders: ({ header }) => header.trim(),
          mapValues: ({ value }) => (typeof value === "string" ? value.trim() : value),
        })
      )
      .on("data", (row) => rows.push(row))
      .on("end", () => {
        try {
          const collections = rows.map((row, index) => {
            const collection = {
              name: row.name || row.collectionName,
              slug: row.slug || row.collectionSlug,
              description: row.description || row.collectionDescription || null,
              blogs: [],
            };

            if (row.blogs) {
              try {
                collection.blogs = JSON.parse(row.blogs);
              } catch (error) {
                throw new APIError(
                  `Invalid blogs JSON in CSV row ${index + 1}: ${error.message}`,
                  400
                );
              }
            }

            return collection;
          });
          resolve(collections);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => reject(new APIError(error.message, 400)));
  });

const parseUnknownStringPayload = async (raw) => {
  try {
    return parseJsonPayload(raw);
  } catch {
    return parseCsvPayload(raw);
  }
};

const normalizeCollection = (raw) => {
  if (!raw || typeof raw !== "object") {
    throw new APIError("Each seed entry must be an object.", 400);
  }

  const { name, slug, description = null, blogs = [] } = raw;

  if (!name || !slug) {
    throw new APIError("Each collection requires both name and slug.", 400);
  }

  const normalizedBlogs = Array.isArray(blogs)
    ? blogs
        .map(normalizeBlog)
        .filter(Boolean)
    : [];

  return {
    name: name.trim(),
    slug: slug.trim(),
    description,
    blogs: normalizedBlogs,
  };
};

const normalizeBlog = (blog) => {
  if (!blog || typeof blog !== "object") {
    return null;
  }

  if (!blog.name || !blog.slug) {
    throw new APIError("Each blog entry must include name and slug.", 400);
  }

  return {
    name: blog.name.trim(),
    slug: blog.slug.trim(),
    imageUrl: blog.imageUrl || "",
    imageAlt: blog.imageAlt || "",
    shortDescription: blog.shortDescription || "",
    longDescription: blog.longDescription || "",
    metaTitle: blog.metaTitle || "",
    metaDescription: blog.metaDescription || "",
    keywords: Array.isArray(blog.keywords) ? blog.keywords : [],
    category: blog.category || "",
    author: blog.author || "ComfortMyTrip Editorial Team",
    createdAt: blog.createdAt || new Date(),
    hotels: Array.isArray(blog.hotels) ? blog.hotels : [],
    activities: Array.isArray(blog.activities) ? blog.activities : [],
  };
};


module.exports = {
  getBlogs,
  createBlogCollection,
  updateBlogCollection,
  deleteBlogCollection,
  getBlogBySlug,
  seedBlogs, // 👈 don’t forget this
};
