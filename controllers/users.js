const express = require('express');
const router = express.Router();

// const { User } = require('../models');
const User = require('../models/user');

router.get('/', (req, res) => {
    User.find({})
        .then((users) => {
            console.log('users', users);
            res.json({ users: users });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

module.exports = router;