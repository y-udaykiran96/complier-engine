const express = require('express');
const runModule = require('./run.handler');

const router = express.Router();

router.post('/run/:lang', runModule.handler)

module.exports = router;