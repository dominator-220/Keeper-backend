const express = require('express');
const jwt = require('jsonwebtoken');
const Note = require('../models/Note');

exports.createNote = async (req, res) => {
	let authorization = req.headers.authorization.split(' ')[1],
		decoded;
	try {
		decoded = jwt.verify(authorization, `${process.env.JWT_SECRET}`);
	} catch (e) {
		return res.status(401).json({ message: 'unauthorized' });
	}

	let { title, description } = req.body;

	let createdNote = new Note({ title, description, postedBy: decoded.id });

	try {
		await createdNote.save();
	} catch (error) {
		return res.status(500).json({ message: 'Unable to create note. Please try again after some time' });
	}

	return res.status(200).json({
		message: 'Created Note successfully',
		note: createdNote,
	});
};

exports.editNote = async (req, res) => {
	let authorization = req.headers.authorization.split(' ')[1],
		decoded;
	try {
		decoded = jwt.verify(authorization, `${process.env.JWT_SECRET}`);
	} catch (e) {
		return res.status(401).json({ message: 'unauthorized' });
	}

	let { title, description, id } = req.body;

	let existingNote;

	try {
		existingNote = await Note.findById(id);
	} catch (error) {
		return res.status(500).json({ message: 'Unable to edit note. Please try again after some time' });
	}

	if (!existingNote) {
		return res.status(404).json({ message: 'Could not find the note with given id' });
	}

	existingNote.title = title;
	existingNote.description = description;

	try {
		await existingNote.save();
	} catch (error) {
		return res.status(500).json({ message: 'Some error occurred in editing note' });
	}

	return res.status(200).json({
		message: 'Edited Note successfully',
		note: existingNote,
	});
};

exports.deleteNote = async (req, res) => {
	let authorization = req.headers.authorization.split(' ')[1],
		decoded;
	try {
		decoded = jwt.verify(authorization, `${process.env.JWT_SECRET}`);
	} catch (e) {
		return res.status(401).json({ message: 'unauthorized' });
	}

	let { id } = req.body;

	try {
		await Note.findByIdAndRemove(id);
	} catch (error) {
		return res.status(500).json({ message: 'Deleting note failed' });
	}

	return res.status(200).json({
		message: 'Deleted note successfully',
	});
};

exports.allNotes = async (req, res) => {
	let authorization = req.headers.authorization.split(' ')[1],
		decoded;
	try {
		decoded = jwt.verify(authorization, `${process.env.JWT_SECRET}`);
	} catch (e) {
		return res.status(401).json({ message: 'unauthorized' });
	}

	let notes;
	try {
		notes = await Note.find({ postedBy: decoded.id });
	} catch (error) {
		return res.status(500).json({ message: 'Error occured' });
	}

	if (!notes || notes.length === 0) {
		return res.status(404).json({ message: 'No notes found' });
	}

	return res.status(200).json({ notes });
};
