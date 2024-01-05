const imageService = require("../services/imageService");

const getProfileImage = async (req, res) => {
  try {
    const result = await imageService.getProfileImage();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getProfileImage,
};
