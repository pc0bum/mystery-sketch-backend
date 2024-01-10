const userDao = require("../models/userDao");
const { error } = require("../utils/error");

const roomService = {
  joinRoom: async (nickname, profileImage) => {
    try {
      // 유저 회원가입
      const createdUserInfo = await userDao.signUp(nickname, profileImage);
      const userId = createdUserInfo.insertId;

      if (!userId) {
        throw new Error("USER_ID_NOT_FOUND");
      }

      // 여기서부터 게임방 입장 로직 (비밀방이 아닌 공용방만 찾도록 설정)
      const existingRooms = await userDao.getExistingRooms();
      const getExistingRoomsID = existingRooms.map((room) => room.id);

      for (const roomId of getExistingRoomsID) {
        const [enrolledPlayersCount] = await userDao.getEnrolledPlayersCount(
          roomId
        );
        const [roomMaxPlayers] = await userDao.getRoomMaxPlayers(roomId);

        if (enrolledPlayersCount.count < roomMaxPlayers.max_players) {
          await userDao.joinRoom(userId, roomId);
          return { message: "JOIN_ROOM_SUCCESS", roomId: roomId };
          // 유저를 입장시킨 후 함수 종료
        }
      }

      // 모든 방이 가득 찬 경우 Create Room
      const createdRoomInfo = await userDao.createRoom();
      //해당 유저 방장으로 업데이트해주기
      await userDao.updateUserRole(userId);
      //방금 만든 방으로 입장 시키기
      const roomId = createdRoomInfo.insertId;
      await userDao.joinRoom(userId, roomId);

      return { message: "CREATE_JOIN_ROOM_SUCCESS", roomId: roomId };
    } catch (error) {
      throw new Error(`Error joining room: ${error.message}`);
    }
  },

  secretJoinRoom: async (nickname, profileImage) => {
    try {
      // 유저 회원가입 및 방장권한 주기
      const createdUserInfo = await userDao.secretSignUp(
        nickname,
        profileImage
      );
      const userId = createdUserInfo.insertId;

      // 방 기본값으로 비밀 방을 만든다.
      const createdRoomInfo = await userDao.secretCreateRoomByDefaultValue();

      //방금 만든 방으로 입장 시키기
      const roomId = createdRoomInfo.insertId;
      await userDao.joinRoom(userId, roomId);

      return { message: "CREATE_SECRET_JOIN_ROOM_SUCCESS", roomId: roomId };
    } catch (error) {
      throw new Error(`Error joining room: ${error.message}`);
    }
  },
};

module.exports = roomService;
