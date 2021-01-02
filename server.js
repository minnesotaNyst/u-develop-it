const express = require('express');
const sqlite3 = require('sqlite3').verbose();

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
// !uncomment this out later in the module
// db.all(`SELECT * FROM candidates`, (err, rows) => {
// 	console.log(rows);
// });

// GET a single candidate
// selecting a single candidate by their primary key is the only way to ensure the candidate requested is the one that's returned.
// !uncomment this out later in the module
// db.get(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
// 	if (err) {
// 		console.log(err);
// 	}
// 	console.log(row);
// });

// Delete a candidate
// The question mark (?) denotes a placeholder, making this a prepared statement. Prepared statements can have placeholders that can be filled in dynamically with real values at runtime.
// An additional param argument can provide values for prepared statement placeholders. Here, we're hardcoding 1 temporarily to demonstrate how prepared statements work. If we need additional placeholders, the param argument can be an array that holds multiple values.
// !uncomment this out later in the module
// db.run(`DELETE FROM candidates WHERE id = ?`, 1, function (err, result) {
// 	if (err) {
// 		console.log(err);
// 	}
// 	console.log(result, this, this.changes);
// });

// Create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];
// ES5 function, not arrow function, to use this
db.run(sql, params, function (err, result) {
	if (err) {
		console.log(err);
	}
	console.log(result, this.lastID);
});

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
