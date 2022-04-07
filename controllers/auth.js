const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const router = require('../routes/auth');

exports.signup = async (req, res) => {
	const { email, password } = req.body;
	let user;
	try {
		user = await User.findOne({ email });
	} catch (error) {
		return res.status(500).json({ message: 'Unable tp sign up. Try again later' });
	}
	if (user) {
		return res.status(400).json({ message: 'Email already exists. Please login instead' });
	} else {
		let hashedPassword;
		try {
			hashedPassword = await bcrypt.hash(password, 12);
		} catch (error) {
			return res.status(500).json({ message: 'An error occured while signing up' });
		}

		let createdUser = new User({
			email,
			password: hashedPassword,
		});

		try {
			await createdUser.save();
		} catch (error) {
			return res.status(500).json({ message: 'Could not create user' });
		}

		return res.status(200).json({ message: 'Signup Successful' });
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	let existingUser;
	try {
		existingUser = await User.findOne({ email });
	} catch (error) {
		return res.status(500).json({ message: 'Unable to log in. Try again later' });
	}
	if (!existingUser) {
		return res.status(404).json({ message: 'Looks like you are not registered' });
	} else {
		let isValidPassword = false;
		try {
			isValidPassword = await bcrypt.compare(password, existingUser.password);
		} catch (e) {
			return res.status(500).json({ message: 'Unable to log in. Try again after some time' });
		}
		if (!isValidPassword) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		let token;

		try {
			token = jwt.sign({ id: existingUser.id, email: existingUser.email }, `${process.env.JWT_SECRET}`, { expiresIn: '4h' });
		} catch (err) {
			return res.status(500).json({ message: 'Logging in failed. Please try after some time' });
		}

		return res.status(200).json({
			message: 'Logged in',
			token,
		});
	}
};
exports.gtf = (req, res) => {
	var authorization = req.headers.authorization.split(' ')[1],
		decoded;
	try {
		decoded = jwt.verify(authorization, `${process.env.JWT_SECRET}`);
	} catch (e) {
		return res.status(401).json({ message: 'unauthorized' });
	}
	var userId = decoded.id;
	res.status(200).json({
		message: 'done',
		token: req.headers.authorization,
		id: userId,
		email: decoded.email,
		decoded,
	});
};
