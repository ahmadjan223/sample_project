const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');

router.post('/api/fields', fieldController.saveFields);
router.post('/api/save-single-polygon', fieldController.saveSinglePolygon);
router.post('/api/reset/:userId', fieldController.resetDatabase);
router.get('/api/load-polygons/:userId', fieldController.loadPolygons);
router.patch('/api/update-field/:name', fieldController.updateField);
router.delete('/api/delete-field/:name', fieldController.deleteField);

module.exports = router;