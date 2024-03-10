// routes/authRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');

const router = express.Router();

router.post('/signup', [validateMiddleware], authMiddleware.signup);

router.post('/signin', [validateMiddleware], authMiddleware.signin);

module.exports = router;
