require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;
const axios = require('axios');
// import formidable from 'formidable';
const formidable = require('formidable');
const fs = require('fs');


const User = require('../models/user');

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

// GET /users/posts
router.get('/posts/', (req, res) => {
    Post.find({})
        .then((posts) => {
            if (posts) {
                res.json({ posts: posts });
            } else {
                res.json({ message: 'No Posts Found' });
            }
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('====> inside /profile');
    console.log(req.body);
    console.log('====> user');
    console.log(req.user);
    const { id, fullName, email, username } = req.user; // object with user object inside
    res.json({ id, fullName, email, username });
});

router.get('/email/:email', passport.authenticate('jwt', { session: false }), (req, res, error) => {
    User.findById(req.params.email)
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

// Get /posts/:id (used for editing comments)
router.get('/username/:username/posts/id/:id', (req, res) => {
    User.findOne({ username: req.params.username })
        .then(user => {
            if (user) {
                const post = user.posts.id(req.params.id);
                res.json({ post: post });
            } else {
                res.json({ message: 'No Post Found' });
            }
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

// GET /users/:username
router.get('/username/:username', (req, res, error) => {
    // console.log('req.params.username', req.params);
    User.findOne({ username: req.params.username })
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

router.get('/posts/username/:username', (req, res) => {
    Post.find({ username: req.params.username })
        .then((posts) => {
            if (posts) {
                res.json({ posts: posts });
            } else {
                res.json({ message: 'No Posts Found' });
            }
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

// GET /comments by comment Id
router.get('/posts/:id/comments/:commentId', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                console.log('post cannot be found');
                return res.json({ message: 'Post cannot be found' });
            }
            // find comment by id
            const comment = post.comments.id(req.params.commentId);
            console.log('--- find comment ---', comment);
            if (!comment) {
                console.log('comment cannot be found');
                return res.json({ message: 'Comment cannot be found' });
            }
            return res.json({ comment });
        })
        .catch(err => {
            console.log('error', err);
            return req.json({ message: 'Comment was not found try again...' });
        });
});

router.post('/signup', (req, res) => {
    // POST - adding the new user to the database
    console.log('===> Inside of /signup');
    console.log('===> /register -> req.body', req.body);

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
router.post('/username/:username/posts/new', passport.authenticate('jwt', { session: false }), (req, res) => {
    const newPost = {
        username: req.body.username,
        caption: req.body.caption,
        photo: req.body.photo,
        likes: 0
    };
    Post.create(newPost)
        .then((post) => {
            return res.json({ post: post });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

router.post('/uploadProfilePicture', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            // Handle error
            res.status(500).json({ error: 'An error occurred' });
        } else {
            // Access the file using files.file
            const file = files.file[0];

            // Save file details to the database using Mongoose
            try {
                console.log('file', file);
                fs.readFile(file.filepath, async (err, data) => {
                    if (err) {
                        console.log('err', err);
                    }
                    console.log('data', data);


                    // // Send a response

                    const formData = new FormData();
                    formData.append('file', data);
                    formData.append('upload_preset', 'instaverse');
                    axios.post('https://api.cloudinary.com/v1_1/dtnostfrb/image/upload', formData)
                        .then(response => {
                            console.log('response', response);
                            // res.json({ profilePicture: response.data.secure_url });
                        })
                        .catch(error => console.log('===> Error in Signup2', error));
                });
            } catch (error) {
                // Handle database or other errors
                res.status(500).json({ error: 'An error occurred' });
            }
        }
    });
    // axios.post('https://api.cloudinary.com/v1_1/dtnostfrb/image/upload', formData);
});

router.post('/login', async (req, res) => {
    // POST - finding a user and returning the user
    console.log('===> Inside of /login');
    console.log('===> /login -> req.body', req.body);

    const foundUser = await User.findOne({ email: req.body.email });

    if (foundUser) {
        // user is in the DB
        let isMatch = await bcrypt.compareSync(req.body.password, foundUser.password);
        console.log('Does the passwords match?', isMatch);
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
                console.log('===> legit', legit);
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

// POST /posts/:id/comments/new (create a new comment)
router.post('/username/:username/posts/:id/comments/new', (req, res) => {
    const newComment = {
        username: req.body.username,
        comment: req.body.comment,
        likes: 0
    };
    User.findOne({ username: req.params.username })
        .then(user => {
            if (!user) {
                console.log('user cannot be found');
                return res.json({ message: 'User cannot be found' });
            } else {
                const post = user.posts.id(req.params.id);
                if (!post) {
                    console.log('post cannot be found');
                    return res.json({ message: 'Post cannot be found' });
                } else {
                    post.comments.push(newComment);
                    user.save()
                        .then((result) => {
                            console.log('post', post);
                            return res.json({ post });
                        })
                        .catch(err => {
                            console.log('error', err);
                            return res.json({ message: 'Comment was not saved try again...' });
                        });
                }
            }
        })
        .catch(err => {
            console.log('error', err);
            return res.json({ message: 'Comment was not saved try again...' });
        });
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
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            return res.json({ message: `${user.username} was deleted` });
        })
        .catch(error => {
            console.log('error', error);
            return res.json({ message: 'There was an issue, please try again' });
        });
});

// Delete /posts/:id (delete a post)
router.delete('/posts/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(post => {
            if (!post) {

                console.log('post cannot be found');
                return res.json({ message: 'Post cannot be found' });
            } else {
                return res.json({ message: `post at ${req.params.id} was deleted` }, { post: post });
            }
        })
        .catch(err => {
            console.log('error', err);
            return res.json({ message: 'Post was not deleted try again...' });
        });
});

module.exports = router;