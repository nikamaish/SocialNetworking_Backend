
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign({ user: { id: user._id, username: user.username } } , process.env.JWT_SECRET,{
    expiresIn: '1h', // Token expiration time
  });
};

const authMiddleware = {
  async signup(req, res, next) {
    try {
      const { username, password } = req.body;

      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new user
      const newUser = await User.create({
        username,
        password: hashedPassword,
      });

      // Generate a JWT token for the new user
      const token = generateToken(newUser);

      res.status(201).json({ message: 'User created', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async signin(req, res, next) {
    try {
      const { username, password } = req.body;

      // Find the user in the database
      const user = await User.findOne({ username });

      // Check if the user exists and the password is correct
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a JWT token for the authenticated user
      const token = generateToken(user);

      // Send the token as a response
      res.status(201).json({ message: 'Signin Successfully', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  middleware(req, res, next) {
    // Get the token from the request headers
    const token = req.header('Authorization');

    // Check if token is present
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Missing Token' });
    }
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded);
    
      // Attach the user information to the request for further use
      req.user = decoded.user;
      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
    }
    
  },
};
module.exports = authMiddleware;
