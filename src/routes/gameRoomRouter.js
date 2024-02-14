const express = require("express");
const router = express.Router();
const gameRoomController = require("../controllers/gameRoomController.js");

router.get("/:roomId", gameRoomController.getGameroomInfo);

router.put("/currentRound" , gameRoomController.updateRoundNumberToDB);


module.exports.router = router;
