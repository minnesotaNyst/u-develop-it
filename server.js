const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const inputCheck = require('./utils/inputCheck');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = new sqlite3.Database('./db/election.db', err => {
	if (err) {
		return console.error(err.message);
	}

	console.log('Connected to the election database.');
});

// This is a test route to see if the server connection is working
// app.get('/', (req, res) => {
// 	res.json({
// 		message: 'Hello World'
// 	});
// });

//  This method runs the SQL query and executes the callback with all the resulting rows that match the query.
// GET all candidates
app.get('/api/candidates', (req, res) => {
	const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id`;
	const params = [];
	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}

		res.json({
			message: 'success',
			data: rows
		});
	});
});

// GET a single candidate
// selecting a single candidate by their primary key is the only way to ensure the candidate requested is the one that's returned.
// This property is an object containing properties mapped to the named route “parameters”. For example, if you have the route /user/:name, then the “name” property is available as req.params.name. In this case, we are using /:id so it is available as params.id.
app.get('/api/candidate/:id', (req, res) => {
	const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id 
             WHERE candidates.id = ?`;
	const params = [req.params.id];
	db.get(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}

		res.json({
			message: 'success',
			data: row
		});
	});
});

// Delete a candidate
// The question mark (?) denotes a placeholder, making this a prepared statement. Prepared statements can have placeholders that can be filled in dynamically with real values at runtime.
// An additional param argument can provide values for prepared statement placeholders. Here, we're hardcoding 1 temporarily to demonstrate how prepared statements work. If we need additional placeholders, the param argument can be an array that holds multiple values.
app.delete('/api/candidate/:id', (req, res) => {
	const sql = `DELETE FROM candidates WHERE id = ?`;
	const params = [req.params.id];
	db.run(sql, params, function (err, result) {
		if (err) {
			res.status(400).json({ error: res.message });
			return;
		}

		res.json({
			message: 'successfully deleted',
			changes: this.changes
		});
	});
});

// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
	const errors = inputCheck(
		body,
		'first_name',
		'last_name',
		'industry_connected'
	);
	if (errors) {
		res.status(400).json({ error: errors });
		return;
	}

	const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`;
	const params = [body.first_name, body.last_name, body.industry_connected];
	// ES5 function, not arrow function, to use `this`
	db.run(sql, params, function (err, result) {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}

		res.json({
			message: 'success',
			data: body,
			id: this.lastID
		});
	});
});

// Create a candidate
// !uncomment this out later in the module
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//               VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// // ES5 function, not arrow function, to use this
// db.run(sql, params, function (err, result) {
// 	if (err) {
// 		console.log(err);
// 	}
// 	console.log(result, this.lastID);
// });

// Default response for any other request(Not Found) Catch all
// !make sure this is the LAST route because it will override all of the others
app.use((req, res) => {
	res.status(404).end();
});

// app.listen(PORT, () => {
// 	console.log(`Server running on port http://localhost:${PORT}`);
// });

// Start server after DB connection
// *To ensure that the Express.js server doesn't start before the connection to the database has been established, let's wrap the Express.js server connection located at the bottom of the server.js file
db.on('open', () => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});
