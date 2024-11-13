// index.js

const express = require('express');
const app = express();
const port = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Define a route for the home page
app.get('/', (req, res) => {
  res.send('Hello, welcome to My Node.js + Express app!');
});

// Example route for testing
app.get('/api', (req, res) => {
  res.json({ message: 'This is the API route' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
