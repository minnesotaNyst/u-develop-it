const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

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

app.listen(PORT, () => {
	console.log(`Server running on port http://localhost:${PORT}`);
});

