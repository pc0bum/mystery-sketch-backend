const mysql = require("mysql2");
const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const socketIO = require("socket.io");
dotenv.config();

const routes = require("./src/routes");
const app = express();
const server = http.createServer(app); // server 객체를 먼저 정의
const io = socketIO(server);

app.use(cors());
app.use(express.json());
app.use(routes);

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
});

const PORT = process.env.TYPEORM_SERVER_PORT;

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Mystery_sketch Server on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start();
