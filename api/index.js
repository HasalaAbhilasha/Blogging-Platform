const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

app.use(cors({ credentials: true, origin: 'https://blogging-platform-production.up.railway.app/"' }));
app.use(express.json());
app.use(cookieParser());
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


app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
