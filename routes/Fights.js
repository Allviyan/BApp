const express = require('express');
const router = express.Router();
const { addBet, addBetResultWinnings} = require('../controllers/bet');
const {  requireSignin } = require('../controllers/admin');
const {  requireSigninUser } = require('../controllers/user');


router.post('/user/bet/addBet', requireSigninUser, addBet)
router.post('/user/result-earnings/addBetRw', requireSignin, addBetResultWinnings)





module.exports = router;