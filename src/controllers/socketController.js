const gameRoomDao = require("../models/gameRoomDao");

const setupSocket = (io) => {
  const messages = [];

  // socket 연결
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // socket disconnected
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });

    // socket 메세지 보내기
    socket.on("message", (data) => {
      messages.push(data);
      io.emit("message", data);
    });

    // socket 게임 스타트
    socket.on("gameStart", (data) => {
      console.log("game start :", data);
      startGame(socket);
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
    socket.on("remainTimer", async ({ remainTime }) => {
      console.log(`Received updated time from client: ${remainTime}`);
      io.emit("updateTimer", remainTime);
    });
    // socket 그림 지우기
    socket.on("eraser", (data) => {
      console.log("지우개 좌표 : ", data);
      io.emit("eraser", data);
    });

    // socket 현재 라운드
    socket.on("isRound", (data) => {
      const roomId = data.roomId;
      const isRound = data.isRound;
      console.log(`룸 아이디 : ${roomId} , 현재라운드 : ${isRound}`);
      io.to(roomId).emit("message", { message: `${isRound}라운드 입니다.` });
    });

    // socket 유저 업데이트
    socket.on("newUserJoined", async ({ roomId }) => {
      console.log("newUserJoined event received with roomId:", roomId);
      console.log("Fetching gameroomInfo...");

      try {
        const gameroomInfo = await gameRoomDao.getGameroomInfo(roomId);
        console.log("Fetched gameroomInfo:", gameroomInfo);
        // 업데이트된 유저 정보를 다른 모든 클라이언트에게 브로드캐스팅
        io.to(roomId).emit("userListUpdate", gameroomInfo);

        // 새로운 유저를 방에 참여시킴
        joinRoom(socket, roomId);
      } catch (error) {
        console.error("Error fetching gameroomInfo:", error);
      }
    });
    const startGame = async (socket) => {
      const roomId = socket.roomId;
      console.log("룸 아이디 : ", roomId);
      if (!roomId) {
        console.error("roomId is not defined for the socket");
        return;
      }
      const socketsInRoom = io.sockets.adapter.rooms.get(roomId).size;
      console.log("방안에 소켓 개수 :", socketsInRoom);
      if (!socketsInRoom || socketsInRoom.size < 2) {
        console.log("Not enough players to start the game");
        return;
      }
      const isRound = await gameRoomDao.getGameRoomCurrentRound(roomId);
      console.log("최소 인원 충족 게임을 시작할 수 있습니다");
      console.log("현재 라운드:", isRound);
      io.to(roomId).emit("gameStarted");
      io.to(roomId).emit("message", { message: "start" });
      io.to(roomId).emit("message", { message: `${isRound}라운드입니다.` });
    };
  });
  const joinRoom = async (socket, roomId) => {
    socket.roomId = roomId;
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    const roomSetting = await gameRoomDao.getRoomSetting(roomId);
    console.log("룸 설정 값 : ", roomSetting);
    io.emit("roomSetting", roomSetting);
  };
};

module.exports = setupSocket;
