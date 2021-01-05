const express = require('express');
const router = express.Router();

// controllers
const { requireSignin, adminMiddleware } = require('../controllers/operatorAuth');
const { createScheduledBooking,listScheduled, getOneScheduled, gettOperatorScheduledHistoryTotal,remove } = require('../controllers/op_scheduled_bookings');

// validators
const { runValidation } = require('../validators');
const { createScheduledValidator } = require('../validators/op_scheduled_bookings');

// only difference is methods not name 'get' | 'post' | 'delete'
router.post('/operator/vehicle/op_scheduled_bookings', createScheduledValidator, runValidation, requireSignin, adminMiddleware, createScheduledBooking);
router.get('/operator/vehicle/op_scheduled_bookings', requireSignin, adminMiddleware,listScheduled);
router.get('/operator/vehicle/op_scheduled_bookings/:slug', requireSignin, adminMiddleware,getOneScheduled);
router.get('/operator/vehicle/op_scheduled_bookings/total/:slug', requireSignin, adminMiddleware, gettOperatorScheduledHistoryTotal);
// router.delete('/operator/vehicle/op_scheduled_bookings', requireSignin, adminMiddleware, remove);

module.exports = router; 
