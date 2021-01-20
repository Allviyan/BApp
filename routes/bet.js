const express = require('express');
const router = express.Router();
const { addBet, addBetResultWinnings} = require('../controllers/bet');
const {  requireSignin } = require('../controllers/auth');



router.post('/user/bet/addBet', requireSignin, addBet);
router.post('/user/result-earnings/addBetRw', requireSignin, addBetResultWinnings)





module.exports = router;