const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const answerRouter = require("./answerRouter");
const imageRouter = require("./imageRouter");
const gameRoomRouter= require("./gameRoomRouter")

//도메인 붙이고 나서 api를 붙이는게 구별하기 쉽다고 어디서 봄
router.use("/api/users", userRouter.router);
router.use("/api/answer", answerRouter.router);
router.use("/api/profileimage", imageRouter.router);
router.use("/api/gameRoom", gameRoomRouter.router);

module.exports = router;
