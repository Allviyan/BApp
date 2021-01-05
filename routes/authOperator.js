const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin } = require('../controllers/operatorAuth');
const {  listScheduled, getOneScheduled, updateScheduled } = require('../controllers/op_scheduled_bookings');
const { listCustBooking, getOneCustBooking,updateCustBooking} = require('../controllers/current_bookings');
const { readAllVehicleOperator, readVehicleOperator, create } = require('../controllers/vehicles');

// validators
const { runValidation } = require('../validators');
const { operatorSignupValidator, operatorSigninValidator } = require('../validators/auth');

router.post('/operator/signup', operatorSignupValidator, runValidation, signup);
router.post('/operator/signin', operatorSigninValidator, runValidation, signin);
router.get('/operator/signout', signout);

//corporate booking
router.get('/operator/schedule-booking', operatorSigninValidator,listScheduled);
router.get('/operator/schedule-booking/:slug', operatorSigninValidator,getOneScheduled);
router.put('/operator/schedule-booking/:slug', operatorSigninValidator,updateScheduled);
//ordinary booking
router.get('/operator/customer/booking', requireSignin, listCustBooking);
router.get('/operator/customer/booking/:slug', requireSignin, getOneCustBooking);
router.put('/operator/customer/update/status/:slug', requireSignin, updateCustBooking);

//get details
router.get('/operator/all/vehicle/:slug', requireSignin, readAllVehicleOperator);
router.get('/operator/single/vehicle/:slug', requireSignin, readVehicleOperator);
//router.post('/operator/vehicle/', requireSignin, create);
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         user: req.user
//     });
// });

module.exports = router;
