const rimraf = require("rimraf");
const path = require("path");
const puppeteer = require("puppeteer");

const LoggerService = require('../services/Logger.service');
const settings = require("../../config.json");
const TestTypes = require("../Enums/TestTypes.enum");
const { mkdirIfNotExists, genUniqueFilename } = require("../utils/File.utils");

const initDirs = [
    settings.ssDir.base,
    path.join(settings.ssDir.base, settings.ssDir.current),
    path.join(settings.ssDir.base, settings.ssDir.original),
    path.join(settings.ssDir.base, settings.ssDir.failed),
];

class Screenshot {
    constructor(options = { reset: false }) {
        this.options = options;

        this.ssDir = options.firstRun
            ? settings.ssDir.original
            : settings.ssDir.current;

        options.reset && this._resetDirectories();
        
        this._generateBaseDirectories();
    }

    _resetDirectories() {
        if(this.options.firstRun) {
            rimraf.sync(settings.ssDir.base);
        }
    }

    _generateBaseDirectories() {
        initDirs.forEach(dir => mkdirIfNotExists(dir));
    }

    async run(testComps) {
        const results = [];
        const baseDir = path.join(settings.ssDir.base, this.ssDir);

        LoggerService.info('Loading Browser');
        const browser = await puppeteer.launch(settings.puppeteer);
        LoggerService.info('Opening New Page');
        const page = await browser.newPage();

        LoggerService.info('Settings Viewport');
        await page.setViewport(settings.viewport);

        for(let currentTest of testComps) {
            const { _id, title, url, ignoreSelectors } = currentTest;
            try {
                LoggerService.info('Navigating to URL');
                await page.goto(url, { waitUntil: 'networkidle2'});
            } catch(e) {
                LoggerService.error('Navigation Error', e.message);
            }

            let fileName = '';
            let filePath = '';

            if(ignoreSelectors) {
                LoggerService.info('Ignore selectors found');
                let ignoreSelectorsSeperated = ignoreSelectors.split(",").map(s => s.trim());
                for(let selector of ignoreSelectorsSeperated) {
                    await page.evaluate(selector => {
                        const elem = document.querySelector(selector);
                        if(elem) elem.style.opacity = '0 !important';
                    }, selector);
                }

                await page.waitForTimeout(200);
            }

            switch(currentTest.type) {
                case TestTypes.PAGE:
                    fileName = genUniqueFilename([TestTypes.PAGE, title], settings.imgExt);
                    filePath = path.join(baseDir, fileName);
                    LoggerService.info('Taking Page Screenshot');
                    await page.screenshot({ path: filePath, fullPage: true });
                    LoggerService.info('Took Screenshot of', title);
                    results.push({ id: _id, filePath, fileName });
                    break;

                case TestTypes.ELEMENT:
                    const { selector, isMultiple } = currentTest;
                    let elements = [];

                    try {
                        await page.waitForSelector(selector);
                    } catch(e) {
                        LoggerService.error('Selector Issue', currentTest);
                        continue;
                    }
                    
                    if(isMultiple) {
                        elements = await page.$$(selector);
                    } else {
                        const singleElementSelector = await page.$(selector);
                        elements = [singleElementSelector];
                    }

                    elements.forEach(async (el, i) => {
                        fileName = genUniqueFilename([TestTypes.ELEMENT, title, i], settings.imgExt);
                        filePath = path.join(baseDir, fileName);
                        
                        try {
                            LoggerService.info('Taking element screenshot');
                            await Promise.race([
                                new Promise((resolve, reject) => setTimeout(() => reject('Timeout'), 1000)),
                                el.screenshot({ path: filePath })
                            ]);

                            results.push({ id: _id, filePath, fileName, isMultiple });
                        } catch(e) {
                            LoggerService.error('Couldnt generate element screenshot', currentTest, i);
                        }
                    });

                    break;

                default:
                    throw new Error(`Unsupported test type: ${currentTest.type}`);
            }
        }

        LoggerService.info('Done, Closing Browser');
        await browser.close();
        LoggerService.info('Return results');
        return results;
    }
}

module.exports = Screenshot;