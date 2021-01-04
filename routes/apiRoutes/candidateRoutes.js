const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

//  This method runs the SQL query and executes the callback with all the resulting rows that match the query.
// GET all candidates
router.get('/candidates', (req, res) => {
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
router.get('/candidate/:id', (req, res) => {
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
router.delete('/candidate/:id', (req, res) => {
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
router.post('/candidate', ({ body }, res) => {
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

// UPDATE a candidates affiliation to a party
router.put('/candidate/:id', (req, res) => {
	// If the front end will be making this request, though, then we should be extra sure that a party_id was provided before we attempt to update the database.
	const errors = inputCheck(req.body, 'party_id');

	if (errors) {
		res.status(400).json({ error: errors });
		return;
	}

	const sql = `UPDATE candidates SET party_id = ? 
				 WHERE id = ?`;
	const params = [req.body.party_id, req.params.id];

	db.run(sql, params, function (err, result) {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}

		res.json({
			message: 'success',
			data: req.body,
			changes: this.changes
		});
	});
});

module.exports = router;
