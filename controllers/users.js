require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;
const { User } = require('../models');

// GET /users
router.get('/', (req, res) => {
    User.find({})
        .then((users) => {
            return res.json({ users: users });
        })
        .catch(error => {
            console.log('error', error);
            return res.json({ message: 'There was an issue, please try again' });
        });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    // console.log('====> inside /profile');
    console.log(req.body);
    // console.log('====> user');
    console.log(req.user);
    const { id, fullName, email, username } = req.user; // object with user object inside
    res.json({ id, fullName, email, username });
});

// GET /users/:id
router.get('/:id', (req, res, error) => {
    User.findById(req.params.id)
        .then(user => {
            if (user) {
                return res.json({ user: user });
            } else {
                return res.json({ message: 'No User Found' });
            }
        })
        .catch(error => {
            console.log('error', error);
            return res.json({ message: 'There was an issue, please try again' });
        });
});

router.post('/signup', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // if email already exists, a user will come back
            if (user) {
                // send a 400 response
                return res.status(400).json({ message: 'Email already in use' });
            } else {
                User.findOne({ username: req.body.username })
                    .then(user => {
                        if (user) {
                            return res.status(400).json({ message: 'Username already taken' });
                        } else {
                            // Create a new user
                            const newUser = new User({
                                fullName: req.body.fullName,
                                email: req.body.email,
                                username: req.body.username,
                                password: req.body.password
                            });

                            // Salt and hash the password - before saving the user
                            bcrypt.genSalt(10, (err, salt) => {
                                if (err) throw Error;

                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) console.log('==> Error inside of hash', err);
                                    // Change the password in newUser to the hash
                                    newUser.password = hash;
                                    newUser.save()
                                        .then(createdUser => {
                                            // remove password from being returned inside of response, still in DB
                                            if (createdUser.password) {
                                                createdUser.password = '...'; // hide the password
                                                res.json({ user: createdUser });
                                            }
                                        })
                                        .catch(err => {
                                            console.log('error with creating new user', err);
                                            res.json({ message: 'Error occured... Please try again.' });
                                        });
                                });
                            });
                        }
                    })
                    .catch(err => {
                        console.log('error with creating new user', err);
                        res.json({ message: 'Error occured... Please try again.' });
                    });
            }
        })
        .catch(err => {
            console.log('Error finding user', err);
            res.json({ message: 'Error occured... Please try again.' });
        });
});

// POST /posts (create a new post)
router.post('/username/:username/posts/new', (req, res) => {
    const newPost = {
        username: req.body.username,
        caption: req.body.caption,
        photo: req.body.photo,
        likes: 0
    };
    // console.log('newPost', newPost);
    User.findOne({ username: req.params.username })
        .then(user => {
            if (!user) {
                console.log('user cannot be found');
                return res.json({ message: 'User cannot be found' });
            } else {
                user.posts.push(newPost);
                user.save()
                    .then((result) => {
                        console.log('post', post);
                        return res.json({ post });
                    })
                    .catch(err => {
                        console.log('error', err);
                        return res.json({ message: 'Comment was not saved try again...1' });
                    });
            }
        })

        .catch(err => {
            console.log('error', err);
            return res.json({ message: 'Comment was not saved try again...2' });
        });
});

router.post('/login', async (req, res) => {
    // POST - finding a user and returning the user
    // console.log('===> Inside of /login');
    // console.log('===> /login -> req.body', req.body);

    const foundUser = await User.findOne({ email: req.body.email });

    if (foundUser) {
        // user is in the DB
        let isMatch = await bcrypt.compareSync(req.body.password, foundUser.password);
        // console.log('Does the passwords match?', isMatch);
        if (isMatch) {
            // if user match, then we want to send a JSON Web Token
            // Create a token payload
            // add an expiredToken = Date.now()
            // save the user
            const payload = {
                id: foundUser.id,
                email: foundUser.email,
                fullName: foundUser.fullName,
                username: foundUser.username
            };
            jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                if (err) {
                    res.status(400).json({ message: 'Session has endedd, please log in again' });
                }
                const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
                // console.log('===> legit', legit);
                delete legit.password; // remove before showing response
                res.json({ success: true, token: `Bearer ${token}`, userData: legit });
            });

        } else {
            return res.status(400).json({ message: 'Email or Password is incorrect' });
        }
    } else {
        return res.status(400).json({ message: 'User not found' });
    }
});

// PUT /users/:id (update a user)
router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(user => {
            return res.json({ message: 'User was updated', user: user });
        })
        .catch(error => {
            console.log('error', error);
            return res.json({ message: 'There was an issue, please try again' });
        });
});

// PUT /posts/:id (update a post)
router.put('/username/:username/posts/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                console.log('post cannot be found');
                return res.json({ message: 'Post cannot be found' });
            } else {
                post.set(req.body);
                post.save()
                    .then((result) => {
                        return res.json({ post });
                    })
                    .catch(err => {
                        console.log('error', err);
                        return res.json({ message: 'Post was not updated try again...' });
                    });
            }
        })
        .catch(err => {
            console.log('error', err);
            return res.json({ message: 'Post was not updated try again...' });
        });
});

// DELETE /users/:id (delete a user)
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    // console.log('entering delete route', req.params.id);
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            return res.json({ message: `${user.username} was deleted` });
        })
        .catch(error => {
            console.log('error', error);
            return res.json({ message: 'There was an issue, please try again' });
        });
});

module.exports = router;