const answerService = require("../services/answerService.js");

const getAnswer = async (req, res) => {
  try {
    const result = await answerService.getAnswer();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


module.exports = {
    getAnswer
  };