const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/user/dashboard
router.get('/dashboard', userController.getUserDashboard);

module.exports = router;
