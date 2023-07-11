require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./user');
const Post = require('./post');
const Following = require('./following');
const Follower = require('./follower');


// connect to the database
mongoose.connect('mongodb://localhost/instaverse', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// create connection object
const db = mongoose.connection;

// once the database opens
db.once('open', () => {
    console.log('Connected to MongoDB Database: Mongoose App at HOST: ', db.host, 'PORT: ', db.port);
});

// if there is a database error
db.on('error', (err) => {
    console.log(`Database error: `, err);
});

module.exports = {
    User,
    Post,
    Following,
    Follower
};