const { request } = require('express');
const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin, getAllUser, getOneUserWallet, updateOneWallet, getOneWallet, getOnePlayer, getWallets, wallets, updateUser, updatePlayerWalletRequest, getOneWalletRequest, getWalletsRequest } = require('../controllers/admin');
const { userList, readUser } = require('../controllers/auth');
//const { userList, readUser } = require('../controllers/auth');
// validators
const { runValidation } = require('../validators');
const { adminSignupValidator, adminSigninValidator } = require('../validators/auth');
router.post('/admin/signup', adminSignupValidator, runValidation, signup);
router.post('/admin/signin', adminSigninValidator, runValidation, signin);
router.get('/admin/signout', signout);


router.get('/admin/getAllUser', requireSignin, getAllUser);
router.get('/admin/getUser/:slug', requireSignin, getOnePlayer);
router.put('/admin/updateUser/:slug', requireSignin, updateUser);

router.get('/admin/getWallets', requireSignin, getWallets)
router.get('/admin/wallet/getOne/:slug', requireSignin, getOneWallet)
router.get('/admin/wallet/getOne/user/:slug', requireSignin, getOneUserWallet)

router.get('/admin/walletRequest/getAll/user', requireSignin, getWalletsRequest)
router.get('/admin/walletRequest/getOne/user/:slug', requireSignin, getOneWalletRequest)
router.put('/admin/requested/wallet/update/:slug', requireSignin, updatePlayerWalletRequest)
// router.put('/admin/wallet/updateOne/:slug', requireSignin, updateOneWallet)


// test
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         user: req.user
//     });
// });

module.exports = router;
