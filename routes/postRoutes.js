const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');

const router = express.Router();

router.post('/', [authMiddleware.middleware, validateMiddleware], (req, res, next) => {
postController.createPost (req, res, next);
});

router.get('/:postId',[authMiddleware.middleware, validateMiddleware], (req, res, next) => {
     postController.viewUserPosts(req, res, next);
    });

router.put('/:postId', [authMiddleware.middleware, validateMiddleware], (req, res, next) => {
     postController.updatePost(req, res, next);
    });

router.delete('/:postId', [authMiddleware.middleware, validateMiddleware], (req, res, next) => {
    postController.deletePost(req, res, next);
});

router.get('/latest', [authMiddleware.middleware, validateMiddleware], (req, res, next) => {
     postController.getLatestPostsFromFollowedUsers(req, res, next);
    });

module.exports = router;
