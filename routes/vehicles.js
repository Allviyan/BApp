const express = require('express');
const router = express.Router();

// controllers
const { requireSignin, adminMiddleware } = require('../controllers/admin');
const { create, listVehicle, readVehicle, remove } = require('../controllers/vehicles');

// validators
const { runValidation } = require('../validators');
const { createTagValidator } = require('../validators/vehicle');

// only difference is methods not name 'get' | 'post' | 'delete'
router.post('/operator/vehicle', createTagValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/operator/vehicle', requireSignin, adminMiddleware,listVehicle);
router.get('/operator/vehicle', readVehicle);
router.delete('/operator/vehicle', requireSignin, adminMiddleware, remove);

module.exports = router; 
