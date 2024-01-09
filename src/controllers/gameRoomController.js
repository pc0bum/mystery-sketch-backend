const gameRoomService = require("../services/gameRoomService.js");

const getGameroomInfo = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const result = await gameRoomService.getGameroomInfo(roomId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getGameroomInfo,
};
