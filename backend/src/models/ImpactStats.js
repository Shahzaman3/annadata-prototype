const mongoose = require('mongoose');

const ImpactStatsSchema = new mongoose.Schema({
      totalMealsServed: { type: Number, default: 0 },
      hungerReductionScore: { type: Number, default: 0 }, // Arbitrary progress metric
      activeZonesAssisted: { type: Number, default: 0 }
});

module.exports = mongoose.model('ImpactStats', ImpactStatsSchema);
