require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport')(passport);
const cloudinary = require('cloudinary').v2;

const app = express();


// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(cors());
app.use(passport.initialize());

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