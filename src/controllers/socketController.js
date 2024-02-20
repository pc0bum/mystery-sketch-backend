const gameRoomDao = require("../models/gameRoomDao");
const userDao = require("../models/userDao");
const gameRoomController = require("../controllers/gameRoomController.js");

const connectedUsers = {};
const plusPoint = 100;
let previousColors = []; // 이전 색상을 저장할 배열

const setupSocket = (io) => {
  const messages = [];

  // socket 연결
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("setUserInfo", async (data) => {
      console.log(`유저 닉네임 : ${data.userNickname}`);
      socket.username = data.userNickname;
      previousColors[socket.username] = [];
    });

    // 추방 기능
    socket.on("expelUser", (data) => {
      console.log(`추방당한 닉네임 : ${data.username}`);
      io.emit("expelUser", data);
    });

    // 실시간 문제 공유 기능
    socket.on("answer", (data) => {
      console.log(`문제 : ${data.answer}`);
      console.log(`문제 공유할 룸 넘버 : ${data.roomId}`);
      io.emit("answer", data);
    });

    // 유저 포인트 추가 기능
    socket.on("point", async (data) => {
      console.log(`포인트 추가 받을 닉네임 : ${data.username}`);
      const currentPoint = await userDao.getUserPoint(data.username);
      console.log(`현재 유저가 가지고 있는 point : ${currentPoint}`);
      const updatedPoint = currentPoint + plusPoint;
      console.log(`업데이트 할 포인트 : ${updatedPoint}`);
      const plusPointToUser = await userDao.updateUserPoint(
        data.username,
        updatedPoint
      );
      console.log(`point 업데이트 결과 : ${plusPointToUser}`);
      const gameRoomInfo = await gameRoomDao.getGameroomInfo(data.roomId);
      console.log(`게임룸 정보 업데이트 : ${gameRoomInfo}`);
      io.emit("userListUpdate", gameRoomInfo);
      io.emit("nextRound");
    });

    // socket gameEnd
    socket.on("gameEnd", () => {
      console.log(`gameEnd!!`);
      io.emit("gameEnd");
    });

    // socket disconnected
    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: ${socket.id}`);
      console.log(`소켓 연결된 유저 : ${connectedUsers}`);

      const roomId = socket.roomId;
      const username = socket.username;

      if (username) {
        try {
          const userId = await userDao.getUserIdByUsername(username);
          console.log(`userId : ${userId}`);
          await userDao.deleteEnrolledPlayers(userId);
          await userDao.deleteUserFromDatabase(userId);
          delete connectedUsers[username];
        } catch (error) {
          console.error("Error handling disconnected user", error);
        }
      }
      if (roomId) {
        try {
          const gameRoomInfo = await gameRoomDao.getGameroomInfo(roomId);
          io.to(roomId).emit("userListUpdate", gameRoomInfo);
        } catch (error) {
          console.error("Error updating user list", error);
        }
      }

      if (username) {
        try {
          // 사용자가 연결을 해제하면 해당 사용자의 이전 색상 배열을 삭제
          delete previousColors[username];
        } catch (error) {
          console.error("Error handling disconnected user", error);
        }
      }
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
    // socket 그림 그리기 권한
    socket.on("pencil", async ({ isRound, roomId }) => {
      console.log(`라운드 & 룸 아이디 : ${isRound} , ${roomId} `);

      const updatePencilAdmin = await gameRoomDao.updatePencilAdminForRound(
        isRound,
        roomId
      );

      console.log(`함수 호출결과 : ${updatePencilAdmin}`);
      const gameroomInfo = await gameRoomDao.getGameroomInfo(roomId);
      const updateRound = await gameRoomDao.updateRoundNumberToDB(
        isRound,
        roomId
      );
      const finalRoundNumber = await gameRoomDao.getRoundNumberFromDB(roomId);
      io.emit("pencilUpdate", gameroomInfo);
      io.emit("pencil", finalRoundNumber);
    });
    // socket 그림 그리기
    socket.on("draw", (data) => {
      io.emit("draw", data);
    });
    // socket 컬러 변경
    socket.on("color", (data) => {
      // 이전 색상을 저장하고 클라이언트에게 전송
      const previousColor =
        previousColors[socket.username][
          previousColors[socket.username].length - 1
        ] || "#000"; // 이전 색상이 없으면 기본값 #000 설정
      previousColors[socket.username].push(data.color); // 새로운 색상을 배열에 추가
      console.log(`이전 컬러 값 : ${previousColor}`);
      io.emit("color", {
        username: socket.username,
        previousColor: [previousColor], // 이전 색상을 배열로 보냅니다.
        newColor: data.color,
      }); // 이전 색상과 새로운 색상을 클라이언트에게 전송
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
    socket.on("isRound", async (data) => {
      const roomId = data.roomId;
      const isRound = data.isRound;
      const transRound = isRound + 1;
      console.log(
        `룸 아이디 : ${roomId} , 받은라운드 : ${isRound} , 현재라운드 : ${transRound}`
      );
      io.to(roomId).emit("isRound", transRound);
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
