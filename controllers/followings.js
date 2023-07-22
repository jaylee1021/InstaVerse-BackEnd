require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;

const { Following } = require('../models');


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

router.get('/:userId', async (req, res) => {
    try {

        const following = await Following.find({ userId: req.params.userId })
            .populate('userId', 'username profilePicture')
            .populate('following', 'username profilePicture');

        res.json({ following: following });
    } catch (error) {
        console.log('error', error);
        res.json({ message: 'There was an issue, please try again' });
    }
});

// POST /followings (create a new following)
router.post('/', (req, res) => {
    Following.findOne({ userId: req.body.userId })
        .then((user) => {
            if (user) {
                console.log('user', user);
                const amIFollowing = user.following.find(f => f._id.toString() === req.body.following);
                if (amIFollowing) {
                    return res.json({ message: 'You are already following this user' });
                } else {
                    user.following.push(req.body.following);
                    user.save();
                    return res.json({ message: 'You are now following this user' });
                }
            } else {
                Following.create({ userId: req.body.userId })
                    .then((user) => {
                        user.following.push(req.body.following);
                        user.save();
                        return res.json({ message: 'You are now following this user' });
                    })
                    .catch(error => {
                        console.log('error', error);
                        res.json({ message: 'There was an issue, please try again' });
                    });
            }
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