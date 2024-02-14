const appDataSource = require("./dataSource");

const getGameroomInfo = async (roomId) => {
  return await appDataSource.query(
    `
  SELECT
  rooms.id AS room_id,
  rooms.max_players,
  rooms.time,
  rooms.round,
  rooms.is_private,
JSON_UNQUOTE(
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'enrolled_id', enrolled_players.id,
      'users_id', enrolled_players.users_id,
      'username', users.username,
      'score', users.score,
      'isAdmin', users.isAdmin,
      'image_link', profile_image.image_link
    )
  )
) AS users
FROM
  rooms
JOIN
  enrolled_players ON rooms.id = enrolled_players.rooms_id
JOIN
  users ON enrolled_players.users_id = users.id
JOIN
  profile_image ON users.profile_image_id = profile_image.id
WHERE
  rooms.id = ?
GROUP BY
  rooms.id, rooms.max_players, rooms.time, rooms.round, rooms.is_private;
    `,
    roomId
  );
};

const getRoomSetting = async (roomId) => {
  return await appDataSource.query(
    `SELECT time , max_players , round FROM rooms where id = ?`,
    [roomId]
  );
};

const updateRoundNumberToDB = async (roundNumber, roomId) => {
  return await appDataSource.query(
    `UPDATE rooms SET current_round = ? WHERE id = ?`,
    [roundNumber, roomId]
  );
};

const getGameRoomCurrentRound = async (roomId) => {
  const result = await appDataSource.query(
    `SELECT current_round FROM rooms WHERE id = ?`,
    [roomId]
  );
  return result[0].current_round;
};

const getUserIdsInRoom = async (roomId) => {
  // 해당 방에 들어온 사용자들의 ID를 가져오는 코드 작성
  // 예를 들어, 데이터베이스에서 해당 방의 사용자 ID를 가져올 수 있습니다.
  const userIds = await appDataSource.query(`
      SELECT users_id FROM enrolled_players WHERE rooms_id = ?;
  `, [roomId]);
  return userIds.map(row => row.users_id);
};

const getPencilAdmin = async (roomId, roundNumber) => {
  try {
      const userIdsInRoom = await getUserIdsInRoom(roomId);
      for (let i = 0; i < userIdsInRoom.length; i++) {
          const userId = userIdsInRoom[i];
          let pencilAdmin = 0;
          if (i === (roundNumber - 1) % userIdsInRoom.length) {
              pencilAdmin = 1;
          }
          // users 테이블 업데이트
          await appDataSource.query(`
              UPDATE users 
              SET pencilAdmin = ? 
              WHERE id = ?
          `, [pencilAdmin, userId]);
      }
      // 클라이언트에게 업데이트된 pencilAdmin 값을 반환
      return userIdsInRoom.map((userId, index) => ({ userId, pencilAdmin: index === (roundNumber - 1) % userIdsInRoom.length ? 1 : 0 }));
  } catch (error) {
      console.error('pencilAdmin 업데이트 중 오류가 발생했습니다.', error);
      throw error;
  }
};

module.exports = {
  getGameroomInfo,
  getRoomSetting,
  updateRoundNumberToDB,
  getGameRoomCurrentRound,
  getPencilAdmin
};
