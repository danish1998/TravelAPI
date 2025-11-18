// models/TravelStory.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const travelStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    description: {
      type: String,
      required: true
    },

    quote: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      required: true
    },

    altText: {
      type: String,
      default: ""
    },

    metaTitle: {
      type: String,
      required: true,
      maxlength: 70
    },

    metaDescription: {
      type: String,
      required: true,
      maxlength: 160
    },

    keywords: {
      type: [String],
      default: []
    },

    category: {
      type: String,
      default: "travel-journey"
    },

    readTime: {
      type: Number,
      default: 5
    },

    published: {
      type: Boolean,
      default: true
    },

    publishedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Auto generate slug from title
travelStorySchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

module.exports = mongoose.model("TravelStory", travelStorySchema);
