const express = require('express');
const Router = express.Router();
const infoController = require('../controllers/infoController');

Router.route('/').get(infoController.videoInfo);

module.exports = Router;