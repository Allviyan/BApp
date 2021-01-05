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
    check('MobileNumber')
        .not()
        .isEmpty()
        .withMessage('MobileNumber is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];


exports.operatorSignupValidator = [
    check('Firstname')
        .not()
        .isEmpty()
        .withMessage('Firstname is required'),
    check('Lastname')
        .not()
        .isEmpty()
        .withMessage('Lastname is required'),
    check('Businessname')
        .not()
        .isEmpty()
        .withMessage('Businessname is required'),
    check('address')
        .not()
        .isEmpty()
        .withMessage('address is required'),          
    check('MobileNumber')
        .not()
        .isEmpty()
        .withMessage('Phone is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('username')
        .not()
        .isEmpty()
        .withMessage('username is required'),       
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];
exports.userSigninValidator = [
    check('MobileNumber')
        .not()
        .isEmpty()
        .withMessage('Must be a valid MobileNumbers'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

exports.operatorSigninValidator = [
    check('username')
    .not()
    .isEmpty()
        .withMessage('User name is required!'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];


exports.adminSignupValidator = [
    check('Firstname')
        .not()
        .isEmpty()
        .withMessage('Firstname is required'),
    check('Lastname')
        .not()
        .isEmpty()
        .withMessage('Lastname is required'),
    check('Businessname')
        .not()
        .isEmpty()
        .withMessage('Businessname is required'),
    check('address')
        .not()
        .isEmpty()
        .withMessage('address is required'),          
    check('MobileNumber')
        .not()
        .isEmpty()
        .withMessage('Phone is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('username')
        .not()
        .isEmpty()
        .withMessage('username is required'),       
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

exports.adminSigninValidator = [
    check('username')
    .not()
    .isEmpty()
        .withMessage('User name is required!'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];
