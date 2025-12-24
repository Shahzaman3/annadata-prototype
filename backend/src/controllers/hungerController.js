const HungerZone = require('../models/HungerZone');

exports.getZones = async (req, res) => {
      try {
            const zones = await HungerZone.find();
            res.json(zones);
      } catch (error) {
            res.status(500).json({ message: error.message });
      }
};

// Seed function to ensure we have data for the map
exports.seedZones = async () => {
      const count = await HungerZone.countDocuments();
      if (count === 0) {
            const zones = [
                  {
                        areaName: "Slum Area A (North)",
                        coordinates: { lat: 28.6139, lng: 77.2090 }, // Example coords
                        hungerScore: 85,
                        priorityLevel: "High",
                        color: "#ff4d4d", // Red
                        details: { childrenPct: 60, elderlyPct: 20, lastMealAvgHours: 18 }
                  },
                  {
                        areaName: "Community Shelter B",
                        coordinates: { lat: 28.5355, lng: 77.3910 },
                        hungerScore: 65,
                        priorityLevel: "Medium",
                        color: "#ffcc00", // Yellow
                        details: { childrenPct: 40, elderlyPct: 30, lastMealAvgHours: 12 }
                  },
                  {
                        areaName: "Orphanage C",
                        coordinates: { lat: 28.4595, lng: 77.0266 },
                        hungerScore: 92,
                        priorityLevel: "High",
                        color: "#ff4d4d",
                        details: { childrenPct: 90, elderlyPct: 0, lastMealAvgHours: 24 }
                  },
                  {
                        areaName: "Low Income Housing D",
                        coordinates: { lat: 28.7041, lng: 77.1025 },
                        hungerScore: 40,
                        priorityLevel: "Low",
                        color: "#33cc33", // Green
                        details: { childrenPct: 30, elderlyPct: 40, lastMealAvgHours: 6 }
                  }
            ];
            await HungerZone.insertMany(zones);
            console.log('Hunger Zones Seeded');
      }
};
