const mongoose = require('mongoose');

const HungerZoneSchema = new mongoose.Schema({
      areaName: { type: String, required: true },
      coordinates: {
            lat: Number,
            lng: Number
      },
      hungerScore: { type: Number, required: true }, // 0-100
      priorityLevel: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            required: true
      },
      color: { type: String, required: true }, // hex code
      details: {
            childrenPct: Number,
            elderlyPct: Number,
            lastMealAvgHours: Number
      }
});

module.exports = mongoose.model('HungerZone', HungerZoneSchema);
