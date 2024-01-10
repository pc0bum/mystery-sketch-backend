const roomService = require("../services/userService");

const joinRoom = async (req, res) => {
  try {
    const nickname = req.body.nickname;
    const profileImage = req.body.profileImage;

    if (!nickname || !profileImage) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }
    const result = await roomService.joinRoom(nickname, profileImage);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const secretJoinRoom = async (req, res) => {
  try {
    const nickname = req.body.nickname;
    const profileImage = req.body.profileImage;

    if (!nickname || !profileImage) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }
    const result = await roomService.secretJoinRoom(nickname, profileImage);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  joinRoom,
  secretJoinRoom,
};
