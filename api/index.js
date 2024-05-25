const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = 'sadadfadhakjsdiasdw9qewd';

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://blog:TrYl5dAkxIM2twSB@cluster0.3ktaekz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({ username, password: bcrypt.hashSync(password, salt) });
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username,
                });
            });
        } else {
            res.status(400).json('Wrong credentials');
        }
    } else {
        res.status(400).json('Wrong credentials');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'Authentication token must be provided' });
    }
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('Logged out');
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
