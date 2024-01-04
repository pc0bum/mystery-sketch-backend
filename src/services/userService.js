const userDao = require('../models/userDao');

const joinRoom = async (nickname, profileImage) => {
    return await userDao.joinRoom(nickname, profileImage);
  };

module.exports = {
    joinRoom
};