// models/Category.js
const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },

    // Thumbnail image
    imageUrl: { type: String, default: '' },
    imageAlt: { type: String, default: '' },

    // Short summary for preview
    shortDescription: { type: String, default: '' },

    // FULL HTML Blog Content
    longDescription: { type: String, default: '' },

    // SEO
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords: { type: [String], default: [] },

    // Extra Info
    category: { type: String, default: '' },
    author: { type: String, default: 'ComfortMyTrip Editorial Team' },

    // For sorting & SEO
    createdAt: { type: Date, default: Date.now },

    // (your previous fields)
    hotels: { type: [String], default: [] },
    activities: { type: [String], default: [] },
  },
  { _id: false }
);

const BlogsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    blogs: { type: [BlogSchema], default: [] },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Blogs", BlogsSchema);
