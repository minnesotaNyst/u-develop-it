const express = require('express');
const db = require('./db/database');

const PORT = process.env.PORT || 3001;
const app = express();

// By adding the /api prefix here, we can remove it from the individual route expressions after we move them to their new home.
const apiRoutes = require('./routes/apiRoutes');
// Use apiRoutes
app.use('/api', apiRoutes);

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// This is a test route to see if the server connection is working
// app.get('/', (req, res) => {
// 	res.json({
// 		message: 'Hello World'
// 	});
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
