const express = require('express');
const router = express.Router();
const { Following } = require('../models');


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