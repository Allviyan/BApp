const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin, wallets, getOneUserWallet, getUserProfile} = require('../controllers/auth');

// validators
const { runValidation } = require('../validators');
const { userSignupValidator, userSigninValidator } = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);


router.get('/user/getWallet/:slug', requireSignin, getOneUserWallet);
router.get('/user/profile/:slug', requireSignin, getUserProfile);
router.post('/user/addWallet', requireSignin, wallets)


// test
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         user: req.user
//     });
// });

module.exports = router;
