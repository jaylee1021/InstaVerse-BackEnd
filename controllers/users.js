const express = require('express');
const router = express.Router();

const User = require('../models/user');

// GET /users
router.get('/', (req, res) => {
    User.find({})
        .then((users) => {
            console.log('users', users);
            return res.json({ users: users });
        })
        .catch(error => {
            console.log('error', error);
            return res.json({ message: 'There was an issue, please try again' });
        });
});

// GET /users/:id
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (user) {
                return res.json({ user: user });
            } else {
                console.log('error', error);
                return res.json({ message: 'No User Found' });
            }
        });
});

// POST /users (create a new user)
router.post('/new', (req, res) => {
    console.log('req.body', req.body);
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                return res.json({ message: 'The username is already taken' });
            } else {
                User.findOne({ email: req.body.email })
                    .then(user => {
                        if (user) {
                            return res.json({ message: 'Email is already in use' });
                        } else {
                            User.create({ username: req.body.username, email: req.body.email })
                                .then(user => {
                                    if (user) {
                                        return res.json({ user: user });
                                    } else {
                                        console.log('error', error);
                                        return res.json({ message: 'User was not created' });
                                    }
                                })
                                .catch(error => {
                                    console.log('error', error);
                                    return res.json({ message: 'There was an issue, please try again' });
                                });
                        }
                    });
            }
        })
        .catch(error => {
            console.log('error', error);
            return res.json({ message: 'There was an issue, please try again' });
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

// DELETE /users/:id (delete a user)
router.delete('/:id', (req, res) => {
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