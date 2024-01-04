const userDao = require('../models/userDao');
const { error } = require('../utils/error');

const roomService = {
    joinRoom: async (nickname, profileImage) => {
        try {
            // 유저 회원가입
            const createdUserInfo = await userDao.signUp(nickname, profileImage);
            const userId = createdUserInfo.insertId;

            if (!userId) {
                throw new Error('USER_ID_NOT_FOUND');
            } 

            // 여기서부터 게임방 입장
            const existingRooms = await userDao.getExistingRooms();
            const getExistingRoomsID = existingRooms.map(room => room.id);
           
            for (const roomId of getExistingRoomsID) {
                const [enrolledPlayersCount] = await userDao.getEnrolledPlayersCount(roomId);
                const [roomMaxPlayers] = await userDao.getRoomMaxPlayers(roomId);

                if (enrolledPlayersCount.count < roomMaxPlayers.max_players) {
                    await userDao.joinRoom(userId, roomId);
                    return {message:'JOIN_ROOM_SUCCESS'};
                    // 유저를 입장시킨 후 함수 종료
                }
            }

            // 모든 방이 가득 찬 경우 Create Room
           const createdRoomInfo = await userDao.createRoom();
           const roomId = createdRoomInfo.insertId;
           await userDao.joinRoom(userId, roomId);

           return {message:'CREATE_JOIN_ROOM_SUCCESS'};

        } catch (error) {
            throw new Error(`Error joining room: ${error.message}`);
        }
    }

};

module.exports = roomService;