const express = require('express');
const router = express.Router();
const { Following } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;
const app = express();

// Apply authentication middleware to all other routes below this line
app.use(passport.authenticate('jwt', { session: false }));
// GET /followings
router.get('/', (req, res) => {
    Following.find({ username: req.body.username })
        .then((followings) => {
            if (followings) {
                return res.json({ followings: followings });
            } else {
                return res.json({ message: 'No Followers Found' });
            }
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

// POST /followings (create a new following)
router.post('/', (req, res) => {
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
router.delete('/:id', (req, res) => {
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