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

const updateRoundNumberToDB = async (req, res) => {
  try {
    const roundNumber = req.body.isRound;
    const roomId = req.body.roomId;
    const result = await gameRoomService.updateRoundNumberToDB(
      roundNumber,
      roomId
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const updatePencilAdminForRound = async (req, res) => {
  try {
    const roundNumber = req.body.isRound;
    const roomId = req.params.roomId;
    const result = await gameRoomService.updatePencilAdminForRound(
      roundNumber,
      roomId
    )
    res.status(200).json(result)
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({message: error.message})
  }
}

module.exports = {
  getGameroomInfo,
  updateRoundNumberToDB,
  updatePencilAdminForRound
};
