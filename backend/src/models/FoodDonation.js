const mongoose = require('mongoose');

const FoodDonationSchema = new mongoose.Schema({
  foodType: { type: String, required: true },
  category: { type: String, enum: ['cooked', 'raw'], default: 'cooked' },
  quantity: { type: Number, required: true }, // Changed to Number for simpler math
  cookingTime: { type: Date },
  expiryDate: { type: Date },
  storageCondition: {
    type: String,
    enum: ['Hot', 'Refrigerated', 'Room Temperature'],
    required: true
  },
  status: {
    type: String,
    enum: ['Valid', 'Rejected', 'Picked Up', 'Delivered'],
    default: 'Valid'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodDonation', FoodDonationSchema);
