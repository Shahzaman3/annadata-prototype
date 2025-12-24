const ImpactStats = require('../models/ImpactStats');

exports.getStats = async (req, res) => {
      try {
            let stats = await ImpactStats.findOne();
            if (!stats) {
                  stats = await ImpactStats.create({ totalMealsServed: 1250, hungerReductionScore: 78 });
            }
            res.json(stats);
      } catch (error) {
            res.status(500).json({ message: error.message });
      }
};
