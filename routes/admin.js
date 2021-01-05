const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin } = require('../controllers/admin');
const { registerOperator, operatorList, read, updateOperatorStatus, deactivateOperatorStatus,updateOperatorDetails } = require('../controllers/operatorAuth');
const { registerCorporate, corporateList,readCorporate, updateCorporateStatus, deactivateCorporateStatus, updateCorporateDetails } = require('../controllers/corp_client');
const { userList, readUser } = require('../controllers/auth');
const { listVehicle, readVehicle, create } = require('../controllers/vehicles');
const { createCustBooking, listCustBooking, getOneCustBooking,getCustBookingHistory,getCustBookingHistoryTotal, remove } = require('../controllers/current_bookings');
const { createScheduledBooking, listScheduled, getOneScheduled,listOperatorScheduled,gettOperatorScheduledHistoryTotal } = require('../controllers/op_scheduled_bookings');
//const { userList, readUser } = require('../controllers/auth');
// validators
const { runValidation } = require('../validators');
const { adminSignupValidator, adminSigninValidator } = require('../validators/auth');
const { createScheduledValidator } = require('../validators/op_scheduled_bookings');
router.post('/admin/signup', adminSignupValidator, runValidation, signup);
router.post('/admin/signin', adminSigninValidator, runValidation, signin);
router.get('/admin/signout', signout);

router.post('/admin/register/operator', requireSignin, registerOperator);
router.post('/admin/register/corporate', requireSignin, registerCorporate);


router.get('/admin/operator', requireSignin, operatorList);
router.get('/admin/operator/:slug',  requireSignin,read);
router.put('/admin/operator/activate/:slug',  requireSignin,updateOperatorStatus);
router.put('/admin/operator/deactivate/:slug',  requireSignin,deactivateOperatorStatus);
router.put('/admin/operator/update/:slug',  requireSignin,updateOperatorDetails);


router.get('/admin/corpclients', requireSignin, corporateList);
router.get('/admin/corpclients/:slug',  requireSignin,readCorporate);
router.put('/admin/corpclients/activate/:slug',  requireSignin,updateCorporateStatus);
router.put('/admin/corpclients/deactivate/:slug',  requireSignin,deactivateCorporateStatus);
router.put('/admin/corpclients/update/:slug',  requireSignin,updateCorporateDetails);



router.get('/admin/users', requireSignin, userList);
router.get('/admin/user/:slug',  requireSignin,readUser);

router.get('/admin/vehicles', requireSignin,listVehicle)
router.post('/admin/vehicles/register', requireSignin,create)
router.get('/admin/vehicle/:slug', requireSignin,readVehicle)


router.post('/admin/corpclients/advance-booking', requireSignin, createScheduledValidator, createScheduledBooking)
router.get('/admin/advance-booking', requireSignin, listScheduled)
router.get('/admin/corpclients/advance-booking/:slug', requireSignin, getOneScheduled),
router.get('/admin/corpclients/advance-booking/list/:slug', requireSignin, listOperatorScheduled)
router.get('/admin/corpclients/advance-booking/total/:slug', requireSignin, gettOperatorScheduledHistoryTotal)

router.get('/admin/current-booking', requireSignin,listCustBooking)
router.get('/admin/current-booking/:slug', requireSignin,getOneCustBooking)
router.get('/admin/current-booking/list/:slug', requireSignin,getCustBookingHistory)
router.get('/admin/current-booking/total/:slug',requireSignin,getCustBookingHistoryTotal)

// test
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         user: req.user
//     });
// });

module.exports = router;
