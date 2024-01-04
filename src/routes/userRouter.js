const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post('/join',userController.joinRoom);

module.exports.router = router ;