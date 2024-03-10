const express = require('express');
const { validationResult } = require('express-validator');
const followController = require('../controllers/followController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');

const router = express.Router();


router.post('/follow', [authMiddleware.middleware, validateMiddleware], (req, res, next) => {
     followController.followUser(req, res, next);
    });


router.post('/unfollow', [authMiddleware.middleware, validateMiddleware], (req, res, next) => {
     followController.unfollowUser(req, res, next);
    });


router.get('/following', [authMiddleware.middleware, validateMiddleware], (req, res, next) => {
     followController.getFollowingList(req, res, next);
    });


router.get('/followers', [authMiddleware.middleware, validateMiddleware], (req, res, next) => {
     followController.getFollowersList(req, res, next);
    });

module.exports = router;
