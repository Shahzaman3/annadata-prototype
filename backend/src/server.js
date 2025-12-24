require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const hungerController = require('./controllers/hungerController');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/annadata';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const foodRoutes = require('./routes/foodRoutes');
const hungerRoutes = require('./routes/hungerRoutes');
const ngoRoutes = require('./routes/ngoRoutes');
const impactRoutes = require('./routes/impactRoutes');

app.use('/api/food', foodRoutes);
app.use('/api/hunger', hungerRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/impact', impactRoutes);

// Database Connection
mongoose.connect(MONGO_URI)
      .then(async () => {
            console.log('MongoDB Connected');
            // Seed initial data
            await hungerController.seedZones();
      })
      .catch(err => console.log(err));

app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
});
