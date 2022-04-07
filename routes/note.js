const express = require('express');

const router = express.Router();
const { noteCheckValidator } = require('../validators/note');
const runValidation = require('../validators/index');
const { createNote, editNote, deleteNote, allNotes } = require('../controllers/note');

router.post('/note/create', noteCheckValidator, runValidation, createNote);
router.post('/note/edit', noteCheckValidator, runValidation, editNote);
router.get('/note/all', allNotes);
router.post('/note/delete', deleteNote);

module.exports = router;
