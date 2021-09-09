const { request } = require('express');
const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin, getOneUserWallet, walletsUserBet, walletsUserBetWin } = require('../controllers/thirdParty');




const { runValidation } = require('../validators');
router.post('/provider/signup',  signup);
router.post('/provider/signin',  signin);
router.get('/provider/signout', signout);

router.get('/provider/getUserWallet/:slug', requireSignin, getOneUserWallet)
router.post('/provider/userBet', requireSignin, walletsUserBet)
router.post('/provider/winBet', requireSignin, walletsUserBetWin)






module.exports = router;