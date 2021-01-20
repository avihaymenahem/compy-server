const fs = require('fs');
const path = require('path');
const looksSame = require("looks-same");
const TestResultModel = require('../models/TestResult.model');
const LoggerService = require('../services/Logger.service');
const settings = require('../../config.json');
const { SingleTestResultModel } = require('../db/schema/SingleTestResult.schema');

const ssDirs = {
    current: path.join(settings.ssDir.base, settings.ssDir.current),
    original: path.join(settings.ssDir.base, settings.ssDir.original),
    failed: path.join(settings.ssDir.base, settings.ssDir.failed),
};

class Compare {
    async compareImages(image1, image2) {
        return new Promise((resolve, reject) => 
            looksSame(image1, image2, (err, { equal }) =>
                !err ? resolve(equal) : reject(err))
        )
    }

    async run(files) {
        let testResults = {...TestResultModel};

        for (let file of files) {
            const { filePath, title } = file;

            const currentFilePath = path.join(ssDirs.current, filePath);
            const originalFilePath = path.join(ssDirs.original, filePath);
            const failedFilePath = path.join(ssDirs.failed, filePath);

            if(!fs.existsSync(originalFilePath)) {
                testResults.failed++;
                testResults.stories.push(new SingleTestResultModel({ testId: file._id, isPassed: false }));
                LoggerService.error(`Original file: ${originalFilePath} Does not exist`);
                return;
            }

            if(!fs.existsSync(currentFilePath)) {
                testResults.failed++;
                testResults.stories.push(new SingleTestResultModel({ testId: file._id, isPassed: false }));
                LoggerService.error(`Current file: ${currentFilePath} Does not exist`);
                return;
            }

            const res = await this.compareImages(originalFilePath, currentFilePath);

            if(res) {
                LoggerService.info(`[Passed] ${title}`)
                testResults.stories.push(new SingleTestResultModel({ testId: file._id, isPassed: true }));
            } else {
                testResults.failed++;
                testResults.stories.push(new SingleTestResultModel({ testId: file._id, isPassed: false }));
                LoggerService.info(`[failed] ${title}`)
                
                looksSame.createDiff({
                    reference: originalFilePath,
                    current: currentFilePath,
                    diff: failedFilePath,
                    ignoreAntialiasing: true,
                    highlightColor: '#ff00ff',
                    strict: false,
                    tolerance: 2.5,
                    antialiasingTolerance: 2.5
                }, () => {});
            }
        }

        testResults.total = files.length;
        LoggerService.info('[Compare] Finished')
        return testResults;
    }
}

module.exports = Compare;