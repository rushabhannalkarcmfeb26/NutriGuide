const express = require('express');
const router = express.Router();
const helpController = require('../controllers/helpController');
const { verifyToken } = require('../middlewares/auth');

router.post('/', verifyToken, helpController.sendHelpRequest);

module.exports = router;
