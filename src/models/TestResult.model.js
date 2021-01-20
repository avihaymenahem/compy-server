const TestResultModel = {
    timeStarted: Date.now(),
    timeEnded: Date.now(),
    total: 0,
    succeed: 0,
    percentage: 0,
    failed: 0,
    stories: []
};

module.exports = TestResultModel;