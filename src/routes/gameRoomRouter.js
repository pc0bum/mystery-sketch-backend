const express = require("express");
const router = express.Router();
const gameRoomController = require("../controllers/gameRoomController.js");

router.get("/:roomId", gameRoomController.getGameroomInfo);

module.exports.router = router;
