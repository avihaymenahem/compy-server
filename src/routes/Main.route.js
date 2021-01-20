const { version, name } = require('../../package.json');
const express = require('express');
const BaseDAL = require('../db/BaseDAL');
const { genSuccessRes, genFailRes } = require('../helpers/ResponseGenerator');

const router = express.Router();

router.get('/', (req, res) => res.json(genSuccessRes({
    version: version,
    name: name,
    healthy: true
})));

module.exports = router;