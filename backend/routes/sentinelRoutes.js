const express = require('express');
const router = express.Router();
const sentinelController = require('../controllers/sentinelController');

// Change to POST to match your React request
router.post('/sentinel/getImageUrl', sentinelController.getImageUrl);
router.post('/sentinel/getLayer', sentinelController.getLayer);

module.exports = router;
