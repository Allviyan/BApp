const express = require('express');
const router = express.Router();

// controllers
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { createCustBooking, listCustBooking, getOneCustBooking, getCustBookingHistory,updateCustBooking,getCustBookingHistoryTotal } = require('../controllers/current_bookings');

// validators
const { runValidation } = require('../validators');
const { createTagValidator } = require('../validators/current_booking');

// only difference is methods not name 'get' | 'post' | 'delete'
router.post('/customer/vehicle/booking', createTagValidator, runValidation, requireSignin, adminMiddleware, createCustBooking);
router.get('/customer/vehicle/booking', requireSignin, adminMiddleware,listCustBooking);
router.get('/customer/vehicle/booking/:slug', requireSignin, adminMiddleware, getOneCustBooking);
router.get('/customer/vehicle/booking/history/:slug', requireSignin, adminMiddleware,getCustBookingHistory)
router.put('/customer/vehicle/update/booking/:slug', requireSignin, adminMiddleware,updateCustBooking)
router.get('/customer/vehicle/booking/history/total/:slug',requireSignin, adminMiddleware,getCustBookingHistoryTotal)

// router.delete('/operator/vehicle/op_scheduled_bookings', requireSignin, adminMiddleware, remove);

module.exports = router; 
