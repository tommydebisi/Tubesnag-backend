const express = require('express');
const Router = express.Router();
const downloadController = require('../controllers/downloadController');

Router.route('/single').get(downloadController.download);
Router.route('/batch').post(downloadController.batchDownload);

module.exports = Router;