const express = require('express');
const { fetchAllResults, truncateResults } = require('../db/schema/Results.schema');
const { genSuccessRes, genFailRes } = require('../helpers/ResponseGenerator');

const router = express.Router();

router.get('/', (req, res) =>     
    fetchAllResults()
        .then(docs => res.json(genSuccessRes(docs)))
        .catch(e => res.json(genFailRes(e.message)))
);

router.delete('/', (req, res) => 
    truncateResults()
        .then(() => res.json(genSuccessRes('Deleted')))
        .catch(e => res.json(genFailRes(e.message)))
);

module.exports = router;