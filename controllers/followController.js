
const Follow = require('../models/Follow');
const User = require('../models/User');

const followUser = async (req, res) => {
  try {
    const { followUserId } = req.body;
    const followerId = req.user.id;

    // Check if the user to be followed exists
    const followUser = await User.findById(followUserId);
    if (!followUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({ follower: followerId, following: followUserId });
    if (existingFollow) {
      return res.status(400).json({ error: 'User already followed' });
    }

    // Create a new follow relationship
    await Follow.create({
      follower: followerId,
      following: followUserId,
    });

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const unfollowUser = async (req, res) => {
    try {
      const { unfollowUserId } = req.body;
      const userId = req.user.id;
  
      // Your logic to unfollow the user here
      // Example: Remove the unfollowUserId from the following array of the current user
      await User.findByIdAndUpdate(userId, { $pull: { following: unfollowUserId } });
  
      res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  const getFollowingList = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Get the user's following list
      const followingList = await Follow.find({ follower: userId }).populate('following', 'username');
  
      res.status(200).json({ followingList: followingList.map(follow => follow.following) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const getFollowersList = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Get the user's followers list
      const followersList = await Follow.find({ following: userId }).populate('follower', 'username');
  
      res.status(200).json({ followersList: followersList.map(follow => follow.follower) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

module.exports = {
  followUser,
  unfollowUser,
  getFollowingList,
  getFollowersList,
};
