const express = require('express');
const router = express.Router();
const { Follower } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;
const app = express();

// Apply authentication middleware to all other routes below this line
app.use(passport.authenticate('jwt', { session: false }));
// GET /followers
router.get('/', (req, res) => {
    Follower.find({ username: req.body.username })
        .then((followers) => {
            if (followers) {
                return res.json({ followers: followers });
            } else {
                return res.json({ message: 'No Followers Found' });
            }
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

// POST /followers (create a new follower)
router.post('/', (req, res) => {
    Follower.create(req.body)
        .then((follower) => {
            return res.json({ follower: follower });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

// DELETE /followers/:id (delete a follower)
router.delete('/:id', (req, res) => {
    Follower.findByIdAndDelete(req.params.id)
        .then((follower) => {
            return res.json({ message: 'Follower Deleted' });
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again' });
        });
});

module.exports = router;