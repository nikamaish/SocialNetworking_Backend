const { body, validationResult } = require('express-validator');

// Custom validation middleware for User model
const validateMiddleware = (req, res, next) => {
  let validationRules = [];

  // Add your validation rules based on the route
  switch (req.path) {
    case '/signup':
    case '/signin':
      validationRules = [
        body('username').notEmpty().isString().isLength({ min: 3, max: 20 }),
        body('password').notEmpty().isString().isLength({ min: 5 }),
      ];
      break;

    case '/profiles/:userId':
      validationRules = [
        body('username').optional().isString().isLength({ min: 3, max: 20 }),
        body('bio').optional().isString().isLength({ max: 150 }),
        body('profilePictureUrl').optional().isString().isURL(),
      ];
      break;

    case '/postId':
      validationRules = [
        body('textContent').notEmpty().isString(),
      ];
      break;


    case '/follow':
      validationRules = [
        body('followUserId').notEmpty().isMongoId(),
      ];
      break;
      case '/unfollow':
      validationRules = [
        body('unfollowUserId').notEmpty().isMongoId(),
      ];

    default:
      // Default validation rules if no specific route matches
      break;
  }

  // Run validation
  Promise.all(validationRules.map(validation => validation.run(req)))
    .then(() => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Validation passed, proceed to the next middleware or route
      next();
    })
    .catch(next); // Handle promise rejections
};

module.exports = validateMiddleware;
