const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.json('Get all settings'));

module.exports = router;