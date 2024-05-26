const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

app.use(cors({ credentials: true, origin: 'https://blogging-platform-alpha.vercel.app/' }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log('Origin:', req.get('origin'));
    next();
});

app.use('/uploads', express.static(__dirname + '/uploads'));

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

app.use(userRoutes);
app.use(blogRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
