const express = require('express');
const router = express.Router();
const controller = require('../controllers/ngoController');

router.get('/requests', controller.getRequests);
router.post('/accept', controller.acceptRequest);

module.exports = router;
