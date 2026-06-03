const express = require('express');
const router = express.Router();
const { createApplication } = require('../controllers/designerApplicationController');

router.post('/', createApplication);

module.exports = router;
