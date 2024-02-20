const appDataSource = require("./dataSource");

const getGameroomInfo = async (roomId) => {
  try {
    const gameroomInfo = await appDataSource.query(
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
              'image_link', profile_image.image_link,
              'pencilAdmin', users.pencilAdmin
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
      [roomId]
    );

    // 사용자 정보를 users_id 기준으로 정렬
    if (gameroomInfo && gameroomInfo.users) {
      const usersArray = JSON.parse(gameroomInfo.users);
      usersArray.sort((a, b) => a.users_id - b.users_id);
      gameroomInfo.users = JSON.stringify(usersArray);
    }

    return gameroomInfo;
  } catch (error) {
    console.error("게임룸 정보 조회 중 오류가 발생했습니다.", error);
    throw error;
  }
};

// getUserIdsInRoom 함수 정의
const getUserIdsInRoom = async (roomId) => {
  // 해당 방에 들어온 사용자들의 ID를 가져오는 코드 작성
  // 예를 들어, 데이터베이스에서 해당 방의 사용자 ID를 가져올 수 있습니다.
  const userIds = await appDataSource.query(
    `
    SELECT users_id FROM enrolled_players WHERE rooms_id = ?;
  `,
    [roomId]
  );
  console.log("유저 아이디들:", userIds);
  return userIds.map((row) => row.users_id);
};

// 라운드 변경 시 pencilAdmin 업데이트
const updatePencilAdminForRound = async (roundNumber, roomId) => {
  try {
    const userIdsInRoom = await getUserIdsInRoom(roomId);
    const totalUsers = userIdsInRoom.length;

    const pencilAdminIndex = (roundNumber - 1) % totalUsers;

    console.log(
      `유저 수 : ${totalUsers} , 라운드 넘버 : ${roundNumber} , 펜슬 인덱스 : ${pencilAdminIndex}`
    );

    // pencilAdmin 값을 업데이트
    await updatePencilAdmin(roomId, userIdsInRoom, pencilAdminIndex);

    // 업데이트된 방 정보를 반환
    const updatedGameroomInfo = await getGameroomInfo(roomId);
    return updatedGameroomInfo;
  } catch (error) {
    console.error(
      "현재 라운드에 대한 연필권한 업데이트 중 오류가 발생했습니다.",
      error
    );
    throw error;
  }
};

// updatePencilAdmin 함수 정의
const updatePencilAdmin = async (roomId, userIdsInRoom, pencilAdminIndex) => {
  try {
    console.log("펜슬 어드민 인덱스 : ", pencilAdminIndex);
    for (let i = 0; i < userIdsInRoom.length; i++) {
      const userId = userIdsInRoom[i];
      let pencilAdmin = pencilAdminIndex === i ? 1 : 0;

      console.log("pencilAdmin : ", pencilAdmin);

      // 데이터베이스에 연필 권한을 업데이트하는 SQL 쿼리
      await appDataSource.query(
        `
        UPDATE users 
        SET pencilAdmin = ?
        WHERE id = ? AND id IN (
          SELECT users_id FROM enrolled_players WHERE users_id = ? AND rooms_id = ?
        );
      `,
        [pencilAdmin, userId, userId, roomId]
      );
    }
  } catch (error) {
    console.error("pencilAdmin 업데이트 중 오류가 발생했습니다.", error);
    throw error;
  }
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

const getRoundNumberFromDB = async (roomId) => {
  try {
    const result = await appDataSource.query(
      `SELECT * FROM rooms WHERE id = ?`,
      [roomId]
    );
    return result[0].current_round;
  } catch (error) {
    console.error(error);
  }
};

const getGameRoomCurrentRound = async (roomId) => {
  const result = await appDataSource.query(
    `SELECT current_round FROM rooms WHERE id = ?`,
    [roomId]
  );
  return result[0].current_round;
};

module.exports = {
  getGameroomInfo,
  getRoomSetting,
  updateRoundNumberToDB,
  getGameRoomCurrentRound,
  updatePencilAdminForRound,
  getRoundNumberFromDB,
};
