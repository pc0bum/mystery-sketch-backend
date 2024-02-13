const answerService = require("../services/answerService.js");

const getAnswer = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const result = await answerService.getAnswer(roomId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


module.exports = {
    getAnswer
  };