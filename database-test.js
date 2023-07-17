require('dotenv').config();
const mongoose = require('mongoose');
const { createRandomUser, createRandomPost, createRandomFollower, createRandomFollowing } = require('./utils');

// const { User, Post } = require('./models');
const User = require('./models/user');
const Post = require('./models/post');
const Follower = require('./models/follower');
const Following = require('./models/following');

mongoose.connect('mongodb://localhost/instaverse', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

// once the database opens
db.once('open', () => {
    console.log('Connected to MongoDB Database: Mongoose App at HOST: ', db.host, 'PORT: ', db.port);
});

// if there is a database error
db.on('error', (err) => {
    console.log(`Database error: `, err);
});

// create 50 users
// for (let i = 0; i < 1; i++) {
//     User.create(createRandomUser())
//         .then((user) => {
//             // console.log(i, user);
//         })
//         .catch((err) => {
//             console.log('error', err);
//         });
// }

// create 100 posts
// for (let i = 0; i < 1; i++) {
//     User.findOneAndUpdate({ username: 'randomdori' }, { $push: { posts: createRandomPost() } }, { new: true })
//         .then((user) => {
//             console.log('Created post: ', user.posts);
//         })
//         .catch((err) => {
//             console.log('error', err);
//         });
// }

// create 10 followers
// for (let i = 0; i < 10; i++) {
//     Follower.create(createRandomFollower())
//         .then((follower) => {
//             console.log('Created follower: ', follower);
//         })
//         .catch((err) => {
//             console.log('error', err);
//         });
// }

// // create 100 following users 
// for (let i = 0; i < 10; i++) {
//     Following.create(createRandomFollowing())
//         .then((following) => {
//             console.log('Created following: ', following);
//         })
//         .catch((err) => {
//             console.log('error', err);
//         });
// }