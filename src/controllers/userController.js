const { json } = require("express");
const roomService = require("../services/userService");

const joinRoom = async (req, res) => {
  try {
    const nickname = req.body.nickname;
    const profileImage = req.body.profileImage;

    if (!nickname || !profileImage) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }
    const doubleCheckNickname = await roomService.doubleCheckNickname(nickname);
    console.log(`컨트롤러 부분 닉네임 : ${doubleCheckNickname}`);

    if (doubleCheckNickname === "USERNAME_NOT_FOUND") {
      const result = await roomService.joinRoom(nickname, profileImage);
      return res.status(200).json(result);
    } else {
      return res.status(500).json({ message: "NICKNAME_DOUBLE_CHECKED_ERROR" });
    }
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
