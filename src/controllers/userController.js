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
    const maxPlayers = req.body.maxPlayers;
    const time = req.body.time;
    const round = req.body.round;

    if (!nickname || !profileImage || !maxPlayers || !time || !round) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }
    const result = await roomService.secretJoinRoom(
      nickname,
      profileImage,
      maxPlayers,
      time,
      round
    );
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
