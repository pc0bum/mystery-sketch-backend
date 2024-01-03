const answerDao = require("../models/answerDao.js");

const getAnswer = async () => {
    return await answerDao.getAnswer();
  };

module.exports = {
    getAnswer
};
  