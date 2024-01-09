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

app.use(cors());
app.use(express.json());
app.use(routes);

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

const PORT = process.env.TYPEORM_SERVER_PORT;

const start = async () => {
  try {
    const io = socketIO(server, {
      cors: {
        origin: "*",
      },
    });
    const setupSocket = require("./src/controllers/socketController");
    setupSocket(io);
    server.listen(PORT, () => console.log(`Mystery_sketch Server on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start();
