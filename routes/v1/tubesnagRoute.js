const express = require("express");
const downloadController = require("../../controllers/tubesnag");
const router = express.Router();

router.route("/single-download").post(downloadController.singleDownload);
router.route("/batch-download").post(downloadController.batchDownload);
module.exports = router;
