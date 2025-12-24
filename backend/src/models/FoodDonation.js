const mongoose = require('mongoose');

const FoodDonationSchema = new mongoose.Schema({
  foodType: { type: String, required: true },
  quantity: { type: String, required: true }, // e.g. "5 kg", "20 servings"
  cookingTime: { type: Date, required: true },
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
