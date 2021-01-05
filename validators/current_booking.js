const { check } = require('express-validator');

exports.createTagValidator = [
 

        check('trip_number')
        .not()
        .isEmpty()
        .withMessage('trip_number is required'),
        check('customer_id')
        .not()
        .isEmpty()
        .withMessage('customer_id is required')

];
