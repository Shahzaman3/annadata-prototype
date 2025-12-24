const express = require('express');
const router = express.Router();
const controller = require('../controllers/foodController');

router.post('/submit', controller.submitFood);

module.exports = router;
