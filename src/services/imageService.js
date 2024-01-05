const imageDao = require("../models/imageDao");

const getProfileImage = async () => {
  return await imageDao.getProfileImage();
};

module.exports = {
  getProfileImage,
};
