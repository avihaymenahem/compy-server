const { getTestById, fetchAllTests } = require('../db/schema/Tests.schema');
const ScreenshotService = require('../services/Screenshot.service');
const CompareService = require('../services/Compare.service');
const LoggerService = require('../services/Logger.service');
const { addNewResult } = require('../db/schema/Results.schema');

class TestController {
    constructor() {}

    async generateBaseScreenshots(firstRun, docId) {
        const ssService = new ScreenshotService({ firstRun });
        let docs = [];
        let results = [];

        if(docId) {
            const singleDoc = await getTestById(docId);
            docs.push(singleDoc);
        } else {
            docs = await fetchAllTests();
        }

        const result = await ssService.run(docs);
        if(firstRun) {
            for(const singleRes of result) {
                const findDoc = docs.find(doc => doc._id === singleRes.id);
                findDoc.filePath = singleRes.fileName;
                findDoc.image = singleRes.filePath;
                findDoc.save()
                results.push(singleRes);
            }
        } else {
            const compare = new CompareService();
            try {
                const compareResults = await compare.run(docs);
                return addNewResult(compareResults);
            } catch(e) {
                LoggerService.error("CANT INSERT TO DB", e);
                return false;
            }
        }

        return results;
    }
}

module.exports = TestController;