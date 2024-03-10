// controllers/userController.js
const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');


const createPost = async (req, res) => {
    try {
      const { textContent } = req.body;
      const userId = req.user.id; // Assuming you have user information in the request
  
      const newPost = await Post.create({
        textContent,
        user: userId,
      });
  
      res.status(201).json(newPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
const viewUserPosts = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user information in the request

    const userPosts = await Post.find({ user: userId });

    res.status(200).json(userPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { textContent } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { textContent },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    await Post.findByIdAndDelete(postId);

    res.status(200).json({message:"Post Deleted Successfully"}); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// controllers/postController.js
const getLatestPostsFromFollowedUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Get the user's following list
    const followingList = await Follow.find({ follower: userId }).select('following');

    // Log the following list for debugging
    console.log('Following List:', followingList);

    // Step 2: Extract user IDs from the following list
    const followedUserIds = followingList.map(follow => follow.following);

    // Log the followed user IDs for debugging
    console.log('Followed User IDs:', followedUserIds);

    // Step 3: Use MongoDB's aggregation framework to get the latest posts
    const socialFeed = await Post.aggregate([
      {
        // Match posts from followed users
        $match: { user: { $in: followedUserIds } },
      },
      {
        // Sort posts by createdAt in descending order (most recent first)
        $sort: { createdAt: -1 },
      },
      {
        // Optionally add a $limit stage to limit the number of posts
        $limit: 10, // Adjust the limit as needed
      },
    ]);

    // Step 4: Respond with the social feed
    res.status(200).json(socialFeed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = {
  createPost,
  viewUserPosts,
  updatePost,
  deletePost,
  getLatestPostsFromFollowedUsers,
};
