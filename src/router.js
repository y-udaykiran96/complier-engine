const express = require('express');
const runFile = require('./run.handler');

const router = express.Router();

router.post('/run/:lang', runFile.handler)

module.exports = router;