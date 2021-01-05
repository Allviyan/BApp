const { check } = require('express-validator');

exports.createTagValidator = [
    check('operator_id')
        .not()
        .isEmpty()
        .withMessage('operator_id is required'),
    check('type_of_vehicle')
        .not()
        .isEmpty()
        .withMessage('type_of_vehicle is required'),
    check('plate_number')
        .not()
        .isEmpty()
        .withMessage('plate_number is required')    
];
