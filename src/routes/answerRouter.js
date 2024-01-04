const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController.js')

router.get('/', answerController.getAnswer);

module.exports.router = router ;