const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');

// Seed/Get Default User
exports.getUserDashboard = async (req, res) => {
      try {
            // For prototype: Always fetch the main user
            let user = await User.findOne({ email: 'shahzaman@example.com' });

            if (!user) {
                  user = new User({
                        name: 'Shahzaman Faisal',
                        email: 'shahzaman@example.com',
                        level: 'Gold Donor',
                        totalMeals: 142,
                        co2Saved: 58,
                        kilosDonated: 14.5,
                        points: 1250
                  });
                  await user.save();
            }

            // Fetch recent activities (last 10 donations)
            // In a real app we'd filter by donorId, but for now we take ALL or mock data
            // Since we didn't add donorId to all existing donations, let's just fetch all Recent ones
            const activities = await FoodDonation.find()
                  .sort({ createdAt: -1 })
                  .limit(10);

            // Format activities for frontend
            const formattedActivities = activities.map(act => {
                  // Time diff logic
                  const diffMs = new Date() - new Date(act.createdAt);
                  const hours = Math.floor(diffMs / (1000 * 60 * 60));
                  const days = Math.floor(hours / 24);
                  let timeStr = 'Just now';
                  if (days > 0) timeStr = `${days} days ago`;
                  else if (hours > 0) timeStr = `${hours} hours ago`;
                  else if (diffMs > 60000) timeStr = `${Math.floor(diffMs / 60000)} mins ago`;

                  return {
                        id: act._id,
                        type: act.category === 'cooked' ? 'Cooked Meal' : 'Raw Ingredients',
                        quantity: `${act.quantity}kg (${act.foodType})`,
                        time: timeStr,
                        status: act.status
                  };
            });

            // Calculate dynamic tier info
            const tierInfo = user.calculateTierInfo();
            // Sync level if different
            if (user.level !== tierInfo.currentTier) {
                  user.level = tierInfo.currentTier;
                  await user.save();
            }

            res.status(200).json({
                  success: true,
                  user: {
                        name: user.name,
                        email: user.email,
                        level: tierInfo.currentTier,
                        totalMeals: user.totalMeals,
                        co2Saved: `${user.co2Saved}kg`,
                        points: user.points,
                        // Progress Data
                        nextLevel: tierInfo.nextTier,
                        mealsToNext: tierInfo.mealsToNext,
                        progress: tierInfo.progress
                  },
                  activities: formattedActivities
            });

      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
};
