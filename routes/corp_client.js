const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin } = require('../controllers/corp_client');
const { createScheduledBooking,listOperatorScheduled, getOneScheduled, updateScheduled } = require('../controllers/op_scheduled_bookings');

// validators
const { runValidation } = require('../validators');
const { operatorSignupValidator, operatorSigninValidator } = require('../validators/auth');
const { createScheduledValidator } = require('../validators/op_scheduled_bookings');


router.post('/corp_client/signup', operatorSignupValidator, runValidation, signup);
router.post('/corp_client/signin', operatorSigninValidator, runValidation, signin);
router.get('/corp_client/signout', signout);


router.post('/corp_client/bookings/', createScheduledValidator, runValidation, requireSignin, createScheduledBooking);
router.get('/corp_client/bookings/:slug', requireSignin,listOperatorScheduled);
router.get('/corp_client/booking/:slug', requireSignin,getOneScheduled);
router.put('/corp_client/booking/:slug', requireSignin,updateScheduled);
// test
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         user: req.user
//     });
// });

module.exports = router;
