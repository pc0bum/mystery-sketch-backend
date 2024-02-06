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
    socket.on("draw", (data) => {
      io.emit("draw", data.x, data.y);
    });
  });
};

module.exports = setupSocket;
