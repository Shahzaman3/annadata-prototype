const FoodDonation = require('../models/FoodDonation');
const PickupRequest = require('../models/PickupRequest');
const HungerZone = require('../models/HungerZone');

// Helper to find best zone (mock logic)
async function findBestZone() {
      // In a real app, this would use geospatial query.
      // Here we just pick a random High priority zone.
      const zone = await HungerZone.findOne({ priorityLevel: 'High' });
      if (zone) return zone;
      return await HungerZone.findOne(); // Fallback
}

exports.submitFood = async (req, res) => {
      try {
            const { foodType, quantity, cookingTime, storageCondition } = req.body;

            // 1. Food Safety Rules (Mock)
            const cookTime = new Date(cookingTime);
            const hoursDiff = (new Date() - cookTime) / (1000 * 60 * 60);

            if (hoursDiff > 6 && storageCondition !== 'Refrigerated') {
                  return res.status(400).json({
                        success: false,
                        message: 'Food rejected: Too old for non-refrigerated storage.'
                  });
            }

            // 2. Create Donation
            const donation = new FoodDonation({
                  foodType,
                  quantity,
                  cookingTime,
                  storageCondition,
                  status: 'Valid'
            });
            await donation.save();

            // 3. Auto-generate Pickup Request (Simulating system matching)
            const targetZone = await findBestZone();
            if (targetZone) {
                  const urgency = targetZone.hungerScore + (hoursDiff * 2); // Simple heuristic
                  const request = new PickupRequest({
                        foodId: donation._id,
                        zoneId: targetZone._id,
                        urgencyScore: urgency,
                        distanceKm: Math.floor(Math.random() * 10) + 1, // Mock distance 1-10km
                        status: 'Pending'
                  });
                  await request.save();
            }

            res.status(201).json({ success: true, message: 'Food verified and accepted!', data: donation });

      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
};
