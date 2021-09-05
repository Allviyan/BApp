const { request } = require('express');
const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin, getOneUserWallet } = require('../controllers/thirdParty');




const { runValidation } = require('../validators');
router.post('/provider/signup',  signup);
router.post('/provider/signin',  signin);
router.get('/provider/signout', signout);

router.get('/provider/getUserWallet/:slug', requireSignin, getOneUserWallet)





module.exports = router;