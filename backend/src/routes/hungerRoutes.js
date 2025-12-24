const express = require('express');
const router = express.Router();
const controller = require('../controllers/hungerController');

router.get('/zones', controller.getZones);

module.exports = router;
