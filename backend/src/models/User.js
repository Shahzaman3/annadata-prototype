const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      level: { type: String, default: 'Bronze Donor' },
      totalMeals: { type: Number, default: 0 },
      co2Saved: { type: Number, default: 0 }, // stored as number (kg)
      kilosDonated: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now }
});

// Methods to calculate tier
UserSchema.methods.calculateTierInfo = function () {
      const meals = this.totalMeals;
      let currentTier = 'Bronze Donor';
      let nextTier = 'Silver Donor';
      let threshold = 50; // Meals needed for Silver

      if (meals >= 1000) {
            currentTier = 'Platinum Donor';
            nextTier = 'Max Level';
            threshold = 1000;
      } else if (meals >= 500) {
            currentTier = 'Gold Donor';
            nextTier = 'Platinum Donor';
            threshold = 1000;
      } else if (meals >= 100) {
            currentTier = 'Silver Donor';
            nextTier = 'Gold Donor';
            threshold = 500;
      } else {
            // Bronze
            currentTier = 'Bronze Donor';
            nextTier = 'Silver Donor';
            threshold = 100;
      }

      const progress = Math.min(100, Math.floor((meals / threshold) * 100));
      const mealsToNext = Math.max(0, threshold - meals);

      return {
            currentTier,
            nextTier,
            threshold,
            progress,
            mealsToNext
      };
};

module.exports = mongoose.model('User', UserSchema);
