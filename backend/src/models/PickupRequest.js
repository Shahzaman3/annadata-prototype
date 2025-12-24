const mongoose = require('mongoose');

const PickupRequestSchema = new mongoose.Schema({
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodDonation', required: true },
      zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'HungerZone', required: true },
      urgencyScore: { type: Number, required: true }, // Calculated based on hunger score + time
      distanceKm: { type: Number, required: true }, // Mocked distance
      status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Completed'],
            default: 'Pending'
      },
      assignedNgo: { type: String, default: null }
});

module.exports = mongoose.model('PickupRequest', PickupRequestSchema);
