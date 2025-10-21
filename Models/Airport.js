const mongoose = require("mongoose");

const AirportSchema = new mongoose.Schema({
  // CSV fields
  id: {
    type: Number,
    unique: true
  },
  ident: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  latitude_deg: {
    type: Number,
    required: true
  },
  longitude_deg: {
    type: Number,
    required: true
  },
  elevation_ft: {
    type: Number
  },
  continent: {
    type: String,
    trim: true,
    uppercase: true
  },
  iso_country: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  iso_region: {
    type: String,
    trim: true
  },
  municipality: {
    type: String,
    trim: true
  },
  scheduled_service: {
    type: String,
    trim: true
  },
  icao_code: {
    type: String,
    uppercase: true,
    trim: true,
    maxlength: 4
  },
  iata_code: {
    type: String,
    uppercase: true,
    trim: true,
    maxlength: 3
  },
  gps_code: {
    type: String,
    uppercase: true,
    trim: true
  },
  local_code: {
    type: String,
    uppercase: true,
    trim: true
  },
  home_link: {
    type: String,
    trim: true
  },
  wikipedia_link: {
    type: String,
    trim: true
  },
  keywords: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes for better search performance
AirportSchema.index({ ident: 1 });
AirportSchema.index({ icao_code: 1 }, { sparse: true });
AirportSchema.index({ iata_code: 1 }, { sparse: true });
AirportSchema.index({ name: "text", municipality: "text", iso_country: "text" });
AirportSchema.index({ municipality: 1 });
AirportSchema.index({ iso_country: 1 });
AirportSchema.index({ iso_region: 1 });
AirportSchema.index({ type: 1 });

module.exports = mongoose.model("Airport", AirportSchema);
