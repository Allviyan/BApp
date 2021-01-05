const { check } = require('express-validator');

exports.createScheduledValidator = [

    check('trip_number')
    .not()
    .isEmpty()
    .withMessage('trip_number is required'),
    check('corp_client_id')
    .not()
    .isEmpty()
    .withMessage('corp_client_id is required')
];
