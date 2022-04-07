const { check } = require('express-validator');

exports.noteCheckValidator = [
	check('title').notEmpty().withMessage('Must have a title'),
	check('description').notEmpty().withMessage('Must have a description'),
];
