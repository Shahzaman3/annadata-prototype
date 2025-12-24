const PickupRequest = require('../models/PickupRequest');
const FoodDonation = require('../models/FoodDonation');
const ImpactStats = require('../models/ImpactStats');

exports.getRequests = async (req, res) => {
      try {
            // Fetch requests and populate food and zone details
            const requests = await PickupRequest.find({ status: 'Pending' })
                  .populate('foodId')
                  .populate('zoneId')
                  .sort({ urgencyScore: -1 }); // Sort by urgency (High to Low)

            res.json(requests);
      } catch (error) {
            res.status(500).json({ message: error.message });
      }
};

exports.acceptRequest = async (req, res) => {
      try {
            const { requestId } = req.body;

            const request = await PickupRequest.findById(requestId);
            if (!request) return res.status(404).json({ message: 'Request not found' });

            request.status = 'Accepted';
            await request.save();

            // Update Food Status
            await FoodDonation.findByIdAndUpdate(request.foodId, { status: 'Picked Up' });

            // Update Impact Stats (Simulated)
            let stats = await ImpactStats.findOne();
            if (!stats) stats = new ImpactStats();

            stats.totalMealsServed += 50; // Mock increment
            stats.hungerReductionScore += 2;
            await stats.save();

            res.json({ success: true, message: 'Pickup Accepted!', data: request });

      } catch (error) {
            res.status(500).json({ message: error.message });
      }
};
