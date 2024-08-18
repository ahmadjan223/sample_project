const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/api/current_user', userController.currentUser);
router.get('/dashboard', userController.dashboard);

module.exports = router;