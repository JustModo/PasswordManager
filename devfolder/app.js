const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library

const app = express();
const PORT = 5000;
const cors = require('cors');

const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
app.use(cors(corsOptions));

app.use(bodyParser.json());

const secretKey = 'your-secret-key'; // Replace with a strong secret key for encoding the JWT token

app.post('/api/auth', (req, res) => {
    const { user_name, password } = req.body;

    // Check the username and password (for demonstration purposes, accept any non-empty values)
    if (user_name && password) {
        // Authentication successful, create a JWT token
        const token = jwt.sign({ user_name }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
        res.json({ token });
    } else {
        // Authentication failed
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});