const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const noteSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		minlength: 5,
	},
	postedBy: {
		type: ObjectId,
		ref: 'User',
		required: true,
	},
});

module.exports = mongoose.model('Note', noteSchema);
