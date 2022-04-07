const express = require('express');

const runValidation = require('../validators/index');

const { signupValidator } = require('../validators/auth');

const { signup, login, gtf } = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signupValidator, runValidation, signup);
router.post('/login', signupValidator, runValidation, login);
router.post('/gtf', gtf);
router.get('/signout');

module.exports = router;
