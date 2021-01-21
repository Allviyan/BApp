const express = require('express');
const router = express.Router();
const { requireSigninUser, authMiddleware, adminMiddleware } = require('../controllers/auth');
const { read } = require('../controllers/user');

router.get('/profile', requireSigninUser, authMiddleware, read);

module.exports = router;
