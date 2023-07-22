require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Post } = require('../models');

// GET /posts
router.get('/', (req, res) => {
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

router.get('/posts', async (req, res) => {
    try {

        const currentUserFollowing = req.query.userIds;

        const posts = await Post.find({ createdBy: { $in: currentUserFollowing } })
            .populate('createdBy', 'username profilePicture') // Populate createdBy
            .populate('comments.createdBy', 'username profilePicture');

        res.json({ posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});



// Get /posts/:userId (used for profile page)
router.get('/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.find({ createdBy: req.params.userId })
        .then((posts) => {
            if (posts) {
                res.json({ posts: posts });
            } else {
                res.json({ message: 'No Posts Found' });
            }
        })
        .catch(error => {
            console.log('error', error);
            res.json({ message: 'There was an issue, please try again00' });
        });
});




// Get /posts/:id (used for editing comments)
router.get('/post/:postId', (req, res) => {
    // console.log('req.params.id', req.params.postId);
    Post.findById(req.params.postId)
        .then(post => {
            if (post) {
                // console.log('post', post);
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

// GET /comments by comment Id
router.get('/post/:id/comments/:commentId', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                console.log('post cannot be found');
                return res.json({ message: 'Post cannot be found' });
            }
            // find comment by id
            const comment = post.comments.id(req.params.commentId);
            // console.log('--- find comment ---', comment);
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


// POST /posts (create a new post)
router.post('/new', (req, res) => {
    const newPost = {
        createdBy: req.body.createdBy,
        caption: req.body.caption,
        photo: req.body.photo
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

// POST /posts/:id/comments/new (create a new comment)
router.post('/:id/comments/new', (req, res) => {
    const newComment = {
        createdBy: req.body.createdBy,
        comment: req.body.comment
    };
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                console.log('post cannot be found');
                return res.json({ message: 'Post cannot be found' });
            } else {
                post.comments.push(newComment);
                post.save()
                    .then((result) => {
                        return res.json({ post: result });
                    })
                    .catch(err => {
                        console.log('error', err);
                        return res.json({ message: 'Comment was not saved try again...' });
                    });
            }
        })
        .catch(err => {
            console.log('error', err);
            return res.json({ message: 'Comment was not saved try again...' });
        });
});

// add likes to comment by comment id
router.post('/:id/comments/:commentId/addLikes', (req, res) => {
    Post.findOne({ _id: req.params.id, 'comments._id': req.params.commentId })
        .then(post => {
            if (!post) {
                console.log('Comment cannot be found');
                return res.json({ message: 'Comment cannot be found' });
            }
            const comment = post.comments.find(c => c._id.toString() === req.params.commentId);
            comment.likes.push(req.body.userId);
            // Save the updated post to the database
            post.save()
                .then(updatedPost => {
                    console.log('Updated post:', comment);
                    return res.json({ comment: comment });
                })
                .catch(error => {
                    console.error('Error saving post:', error);
                    return res.status(500).json({ message: 'Like was not saved, try again...' });
                });
        })
        .catch(error => {
            console.error('Error finding post:', error);
            return res.status(500).json({ message: 'Like was not saved, try again...' });
        });
});

// remove likes to comment by comment id
router.post('/:id/comments/:commentId/removeLikes', (req, res) => {
    Post.findOne({ _id: req.params.id, 'comments._id': req.params.commentId })
        .then(post => {
            if (!post) {
                console.log('Comment cannot be found');
                return res.json({ message: 'Comment cannot be found' });
            }
            const comment = post.comments.find(c => c._id.toString() === req.params.commentId);
            const index = comment.likes.indexOf(req.body.userId);
            comment.likes.splice(index, 1);
            // Save the updated post to the database
            post.save()
                .then(updatedPost => {
                    console.log('Updated post:', comment);
                    return res.json({ comment: comment });
                })
                .catch(error => {
                    console.error('Error saving post:', error);
                    return res.status(500).json({ message: 'Like was not saved, try again...' });
                });
        })
        .catch(error => {
            console.error('Error finding post:', error);
            return res.status(500).json({ message: 'Like was not saved, try again...' });
        });
});

// POST /posts/:id/likes (create a new like)
router.post('/:id/addLikes', (req, res) => {
    console.log('req.body', req.body.userId);
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                console.log('post cannot be found');
                return res.json({ message: 'Post cannot be found' });
            } else {
                post.likes.push(req.body.userId);
                post.save()
                    .then((result) => {
                        console.log('result', result);
                        return res.json({ post: result });
                    })
                    .catch(err => {
                        console.log('error', err);
                        return res.json({ message: 'Like was not saved try again...' });
                    });
            }
        })
        .catch(err => {
            console.log('error', err);
            return res.json({ message: 'Like was not saved try again...' });
        });
});

router.post('/:id/removeLikes', (req, res) => {
    console.log('req.body', req.body.userId);

    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                console.log('post cannot be found');
                return res.json({ message: 'Post cannot be found' });
            } else {
                const index = post.likes.indexOf(req.body.userId);
                post.likes.splice(index, 1);
                post.save()
                    .then((result) => {
                        console.log('result', result);
                        return res.json({ post: result });
                    })
                    .catch(err => {
                        console.log('error', err);
                        return res.json({ message: 'Like was not saved try again...' });
                    });
            }
        })
        .catch(err => {
            console.log('error', err);
            return res.json({ message: 'Like was not saved try again...' });
        });
});


// PUT /posts/:id (update a post)
router.put('/posts/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
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
