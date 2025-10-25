// models/Favorite.js
const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  favorites: {
    type: [{
      id: { type: String, required: true },
      name: { type: String },
      type: { type: String },
      destinationName: { type: String },
      price: { type: String },
      currency: { type: String },
      rating: { type: Number },
      reviewCount: { type: Number },
      duration: { type: String },
      location: { type: String },
      description: { type: String },
      productUrl: { type: String },
      images: { type: [String], default: [] },
    }],
    default: []
  }
});

module.exports = mongoose.model("Favorite", favoriteSchema);
