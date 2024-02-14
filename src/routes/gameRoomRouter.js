const express = require("express");
const router = express.Router();
const gameRoomController = require("../controllers/gameRoomController.js");

router.post("/:roomId", gameRoomController.getGameroomInfo);

router.put("/currentRound" , gameRoomController.updateRoundNumberToDB);

// router.post("/getPencilAdmin/:roodId", gameRoomController.getPencilAdmin)

module.exports.router = router;
