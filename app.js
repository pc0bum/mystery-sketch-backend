const mysql = require("mysql2");
const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const routes = require("./src/routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

const server = http.createServer(app);
const PORT = process.env.TYPEORM_SERVER_PORT;

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Mystery_sketch Server on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start();
