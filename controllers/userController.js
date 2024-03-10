
const User = require('../models/User');

 const viewProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve the user profile
    const userProfile = await User.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

 const updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, bio, profilePictureUrl } = req.body;

    // Update the user profile
    const updatedUserProfile = await User.findByIdAndUpdate(
      userId,
      {
        username,
        bio,
        profilePictureUrl,
      },
      { new: true }
    );

    res.status(200).json(updatedUserProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

 const deleteProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Delete the user profile
    await User.findByIdAndDelete(userId);

    res.status(200).json({message:"Deleted Successfully"}); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
 
  viewProfile,
  updateProfile,
  deleteProfile,

  
};