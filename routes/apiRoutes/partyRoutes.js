const express = require('express');
const router = express.Router();
const db = require('../../db/database');

// GET all parties
router.get('/parties', (req, res) => {
	const sql = `SELECT * FROM parties`;
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

// GET a single party
router.get('/party/:id', (req, res) => {
	const sql = `SELECT * FROM parties WHERE id = ?`;
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

// DELETE a party
// Because the intention of this route is to remove a row from the table, we should use app.delete() instead of app.get().
// We also need to use normal function syntax for the db.run() callback instead of an arrow function, or else we'd lose the context of this.changes.
router.delete('/party/:id', (req, res) => {
	const sql = `DELETE FROM parties WHERE id = ?`;
	const params = [req.params.id];
	db.run(sql, params, function (err, result) {
		if (err) {
			res.status(400).json({ error: res.message });
			return;
		}

		res.json({ message: 'successfully deleted', changes: this.changes });
	});
});

module.exports = router;
