const gameRoomDao = require("../models/gameRoomDao");

const setupSocket = (io) => {
  const messages = [];

  // socket 연결
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // socket 메세지 보내기
    socket.on("message", (data) => {
      messages.push(data);
      io.emit("message", data);
    });
    // socket 그림 그리기
    socket.on("draw", (data) => {
      io.emit("draw", data);
    });
    // socket 컬러 변경
    socket.on("color", (data) => {
      io.emit("color", data);
    });
    // 실시간 타이머
    socket.on("remainTimer", async ({ remainTime, roomId }) => {
      console.log(`Received updated time from client: ${remainTime}`);
      const roomSetting = await gameRoomDao.getRoomSetting(roomId);
      console.log("룸 설정 값 : ", roomSetting);
      io.emit("updateTimer", remainTime, roomSetting);
    });

    // socket 유저 업데이트
    socket.on("newUserJoined", async ({ roomId }) => {
      console.log("newUserJoined event received with roomId:", roomId);
      console.log("Fetching gameroomInfo...");

      try {
        const gameroomInfo = await gameRoomDao.getGameroomInfo(roomId);
        console.log("Fetched gameroomInfo:", gameroomInfo);
        // 업데이트된 유저 정보를 다른 모든 클라이언트에게 브로드캐스팅
        io.emit("userListUpdate", gameroomInfo);
      } catch (error) {
        console.error("Error fetching gameroomInfo:", error);
      }
    });
  });
};

module.exports = setupSocket;
