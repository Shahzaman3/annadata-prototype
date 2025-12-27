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
            const { foodType, category, quantity, cookingTime, expiryDate, storageCondition } = req.body;
            const User = require('../models/User'); // Lazy import

            // 1. Food Safety Rules (Mock)
            // If cooked, check cooking time
            if (category === 'cooked' && cookingTime) {
                  const cookTime = new Date(cookingTime);
                  const hoursDiff = (new Date() - cookTime) / (1000 * 60 * 60);
                  if (hoursDiff > 6 && storageCondition !== 'Refrigerated') {
                        return res.status(400).json({
                              success: false,
                              message: 'Food rejected: Too old for non-refrigerated storage.'
                        });
                  }
            }
            // If raw, check expiry
            if (category === 'raw' && expiryDate) {
                  const expDate = new Date(expiryDate);
                  if (expDate < new Date()) {
                        return res.status(400).json({
                              success: false,
                              message: 'Food rejected: Expired items cannot be donated.'
                        });
                  }
            }

            // 2. Create Donation
            const donation = new FoodDonation({
                  foodType,
                  category: category || 'cooked',
                  quantity: parseFloat(quantity),
                  cookingTime,
                  expiryDate,
                  storageCondition,
                  status: 'Valid'
            });
            await donation.save();

            // 3. Update User Stats (Default User)
            const qtyNum = parseFloat(quantity);
            const user = await User.findOne({ email: 'shahzaman@example.com' });
            if (user) {
                  user.kilosDonated += qtyNum;
                  user.totalMeals += Math.floor(qtyNum * 4);
                  user.co2Saved += Math.floor(qtyNum * 2.5);
                  user.points += Math.floor(qtyNum * 10);

                  // Level Up Logic
                  if (user.points > 5000) user.level = 'Platinum Donor';
                  else if (user.points > 2000) user.level = 'Gold Donor';
                  else if (user.points > 500) user.level = 'Silver Donor';

                  await user.save();
            }

            // 4. Auto-generate Pickup Request (Simulating system matching)
            const targetZone = await findBestZone();
            if (targetZone) {
                  // Urgency calculation
                  let urgency = targetZone.hungerScore;
                  if (cookingTime) {
                        const hoursDiff = (new Date() - new Date(cookingTime)) / (1000 * 60 * 60);
                        urgency += (hoursDiff * 2);
                  } else {
                        urgency += 5; // Base urgency for raw food
                  }

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
