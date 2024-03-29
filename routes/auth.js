const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSigninUser, wallets, getOneUserWallet, getUserProfile, getOneUserWalletRequest, updateUserRequestWallet, updateUserProfile} = require('../controllers/auth');
const {getUserBalance, getGameLink, getGameTransaction, reloadBalancePP} = require('../controllers/ppgames'); 
const {getAllGameList, getOneGame} = require('../controllers/admin'); 


// validators
const { runValidation } = require('../validators');
const { userSignupValidator, userSigninValidator } = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSigninValidator, signin);
router.get('/signout', signout);


router.get('/user/getWallet/:slug', requireSigninUser, getOneUserWallet);
router.get('/user/profile/:slug', requireSigninUser, getUserProfile);
router.put('/user/update/profile/:slug', requireSigninUser, updateUserProfile);
router.post('/user/wallet', requireSigninUser, wallets)
router.get('/user/request/balance/:slug', requireSigninUser, getOneUserWalletRequest)
router.put('/user/updateUserWalletRequest/:slug', requireSigninUser, updateUserRequestWallet)


router.get('/user/getbalance/ppgames/:slug', requireSigninUser, getUserBalance)
router.post('/user/getgameslink/ppgames', requireSigninUser, getGameLink)
router.post('/user/reloadPPwallet/ppgames', requireSigninUser, reloadBalancePP)


router.get('/user/get-all-games', requireSigninUser, getAllGameList)
router.get('/user/get-one-game/:slug', requireSigninUser, getOneGame)

// test
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         user: req.user
//     });
// });

module.exports = router;
