// app.js
const express = require('express');
const dotenv = require('dotenv');
const db = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
// dotenv.config();
const app = express();
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const followRoutes = require('./routes/followRoutes'); // Include the new follow routes
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);


app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/follow', followRoutes); 




// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
