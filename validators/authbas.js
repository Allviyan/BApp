const { check } = require('express-validator');

exports.userSignupValidator = [
    check('Firstname')
        .not()
        .isEmpty()
        .withMessage('Firstname is required'),
    check('Lastname')
        .not()
        .isEmpty()
        .withMessage('Lastname is required'),
    check('Phone')
        .not()
        .isEmpty()
        .withMessage('Phone is required'),
    check('TandC')
        .not()
        .isEmpty()
        .withMessage('TandC is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

exports.userSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];
