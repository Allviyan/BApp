const { check } = require('express-validator');

exports.createTagValidator = [
    check('vehicle_request_number')
        .not()
        .isEmpty()
        .withMessage('vehicle_request_number is required'),
    check('vehicle_requirements')
        .not()
        .isEmpty()
        .withMessage('vehicle_requirements is required'),
        check('products_to_be_delivered')
        .not()
        .isEmpty()
        .withMessage('products_to_be_delivered is required')
];
