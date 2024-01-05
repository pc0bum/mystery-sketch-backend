const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");

router.get("/", imageController.getProfileImage);

module.exports.router = router;
