require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    return res.json({ message: 'Welcome to InstaVerse Backend' });
});

app.use('/users', require('./controllers/users'));
app.use('/posts', require('./controllers/posts'));
app.use('/followers', require('./controllers/followers'));
app.use('/followings', require('./controllers/followings'));


app.use(methodOverride('_method'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server connected to PORT: ${PORT}`);
});

module.exports = app;