const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleAuth, authController.googleAuthCallback);
router.get('/api/logout', authController.logout);

module.exports = router;