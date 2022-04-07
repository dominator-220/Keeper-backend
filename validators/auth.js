const { check } = require('express-validator');

exports.signupValidator = [
	check('email').notEmpty().isEmail().withMessage('Email provided is not valid'),
	check('password').isLength({ min: 5 }).withMessage('Password must have a length of atleast 5 characters'),
];
