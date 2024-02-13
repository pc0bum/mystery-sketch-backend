const answerDao = require("../models/answerDao.js");

let excludedIdsPerRoom = {};
console.log(excludedIdsPerRoom)

const getAnswer = async (roomId) => {
    if (!excludedIdsPerRoom[roomId]) {
        excludedIdsPerRoom[roomId] = [];
    }

    const answer = await answerDao.getAnswer(roomId, excludedIdsPerRoom[roomId]);

    if (answer.length > 0 && !excludedIdsPerRoom[roomId].includes(answer[0].id)) {
        excludedIdsPerRoom[roomId].push(answer[0].id);
    }

    return answer;
};

module.exports = {
    getAnswer,
};

  