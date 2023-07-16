require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;

const Following = require('../models/following');


// GET /followings
router.get('/', (req, res) => {
    Following.find({})
        .then((following) => {
            if (following.length > 0) {
                return res.json({ following: following });
            } else {
                return res.json({ message: 'No following Found' });
            }
        })
        .catch((error) => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

// POST /followings (create a new following)
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Following.create(req.body)
        .then((following) => {
            return res.json({ following: following });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

// DELETE /followings/:id (delete a following)
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Following.findByIdAndDelete(req.params.id)
        .then((following) => {
            return res.json({ message: 'Following Deleted' });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

module.exports = router;