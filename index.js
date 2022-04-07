const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/note');

app.use('/api', authRoutes);
app.use('/api', noteRoutes);
app.get('/', (req, res) => {
	res.status(200).json({ "ITS": "WORLING" });
})

const port = process.env.PORT || 8000;

const DB_CONNECTION = `mongodb+srv://dominator1234:${process.env.DB_PWD}@keeper-cluster.a5fl7.mongodb.net/mykeeper?retryWrites=true&w=majority`;

mongoose
	.connect(
		`${DB_CONNECTION}`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: true,
			useCreateIndex: true,
		}
	)
	.then(() => {
		app.listen(port, () => {
			console.log('DBCONNECTED');
			console.log(`server started at port ${port}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
