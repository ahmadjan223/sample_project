const express = require('express');
const router = express.Router();
const sentinelController = require('../controllers/sentinelController');

// Change to POST to match your React request
router.post('/sentinel/getImageUrl', sentinelController.getImageUrl);
router.post('/sentinel/getIndexValues', sentinelController.getIndexValues);

module.exports = router;