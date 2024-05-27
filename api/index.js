const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Routes
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log('Origin:', req.get('origin'));
    next();
});

app.use('/uploads', express.static(__dirname + '/uploads'));

// Database connections
mongoose.set('debug', true);

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

// API-Endpoint Routes 
app.use(userRoutes);
app.use(blogRoutes);

const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
