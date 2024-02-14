const gameRoomDao = require("../models/gameRoomDao.js");

// 게임방 정보, 들어온 유저 정보
const getGameroomInfo = async (roomId ,roundNumber) => {
  const result = await gameRoomDao.getGameroomInfo(roomId, roundNumber);
  // 유저 정보 데이터 형태 변환 코드
  const gameRoomInfo = {
    room_id: result[0].room_id,
    max_players: result[0].max_players,
    time: result[0].time,
    round: result[0].round,
    is_private: result[0].is_private,
    users: JSON.parse(result[0].users),
  };
  return { message: "GET_GAME_ROOM_INFO_SUCCESS", gameRoomInfo: gameRoomInfo };
};

const updateRoundNumberToDB = async (roundNumber, roomId) => {
  const result = await gameRoomDao.updateRoundNumberToDB(roundNumber, roomId);

  return result;
};

module.exports = {
  getGameroomInfo,
  updateRoundNumberToDB,
  // getPencilAdmin
};
