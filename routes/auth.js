const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSigninUser, wallets, getOneUserWallet, getUserProfile} = require('../controllers/auth');

// validators
const { runValidation } = require('../validators');
const { userSignupValidator, userSigninValidator } = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);


router.get('/user/getWallet/:slug', requireSigninUser, getOneUserWallet);
router.get('/user/profile/:slug', requireSigninUser, getUserProfile);
router.post('/user/addWallet', requireSigninUser, wallets)


// test
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         user: req.user
//     });
// });

module.exports = router;
