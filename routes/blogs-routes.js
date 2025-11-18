const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();

const {
  getBlogs,
  createBlogCollection,
  updateBlogCollection,
  deleteBlogCollection,
  seedBlogs,
  getBlogBySlug,
} = require("../Controllers/blogsController");
const { asyncHandler } = require("../middleware/ErrorHandler");

// GET all blogs
router.get("/", asyncHandler(getBlogs));

// CREATE new blog collection
router.post("/", asyncHandler(createBlogCollection));

// get collection by slug
router.get("/:slug", asyncHandler(getBlogBySlug));

// UPDATE collection by slug
router.put("/:slug", asyncHandler(updateBlogCollection));

// DELETE collection by slug
router.delete("/:slug", asyncHandler(deleteBlogCollection));

// SEED from request body / uploaded file
router.post("/seed/init", upload.single("file"), asyncHandler(seedBlogs)); // e.g. POST /api/v1/blogs/seed/init

module.exports = router;