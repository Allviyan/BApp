const express = require('express');
const router = express.Router();

// controllers
const { requireSignin, adminMiddleware } = require('../controllers/corp_client');
const { create, list, read, remove } = require('../controllers/corp_client_request');

// validators
const { runValidation } = require('../validators');
const { createTagValidator } = require('../validators/corp_client_request');

// only difference is methods not name 'get' | 'post' | 'delete'
router.post('/corporate_client/corp_client_request', createTagValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/corporate_client/corp_client_request', requireSignin, adminMiddleware,list);
router.get('/corporate_client/corp_client_request', read);
// router.delete('/operator/vehicle/op_scheduled_bookings', requireSignin, adminMiddleware, remove);

module.exports = router; 
