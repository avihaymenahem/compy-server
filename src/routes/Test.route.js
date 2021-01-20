const express = require('express');
const { fetchAllTests, getTestById, updateTest, removeTest } = require('../db/schema/Tests.schema');
const { genSuccessRes, genFailRes } = require('../helpers/ResponseGenerator');
const TestController = require('../controllers/Test.controller');
const LoggerService = require('../services/Logger.service');

const router = express.Router();

router.get('/run', async (req, res) => { 
    const testController = new TestController();
    try {
        const result = await testController.generateBaseScreenshots(req.query.first, req.params.id);
        res.json(genSuccessRes(result));
    } catch(e) {
        LoggerService.error('Failed to run', e.message);
        res.json(genFailRes(e.message))
    }
});

router.get('/:id', (req, res) => 
    getTestById(req.params.id)
        .then(doc => res.json(genSuccessRes(doc)))
        .catch(e => res.json(genFailRes(e.message)))
);

router.post('/:id', (req, res) => {
    updateTest(req.body)
        .then(async resp => {
            const testController = new TestController();
            const result = await testController.generateBaseScreenshots(true, resp.id);
            res.json(genSuccessRes(result));
        })
});

router.delete('/:id', (req, res) => {
    getTestById(req.params.id)
        .then(resp => {
            removeTest(resp)
                .then(() => res.json(genSuccessRes(req.params.id)));
        })
        .catch(e => res.json(genFailRes(e.message)));
});

router.get('/', (req, res) => 
    fetchAllTests()
        .then(docs => res.json(genSuccessRes(docs)))
        .catch(e => res.json(genFailRes(e.message)))
);

router.post('/', (req, res) => {
    createNewTest(req.body)
        .then(async resp => {
            const testController = new TestController();
            const result = await testController.generateBaseScreenshots(true, resp.id);
            res.json(genSuccessRes(result));
        })
    res.json('Create new test')
});

module.exports = router;