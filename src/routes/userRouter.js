const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/join", userController.joinRoom);
router.post("/secretjoin", userController.secretJoinRoom);

module.exports.router = router;
