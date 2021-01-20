const mongoose = require('mongoose');
const {SingleTestResultSchema} = require('./SingleTestResult.schema');

const ResultsSchema = new mongoose.Schema({
    timeStarted: { type: Date, default: Date.now },
    timeEnded: { type: Date, default: Date.now },
    total: Number,
    failed: Number,
    succeed: Number,
    percentage: Number,
    stories: [SingleTestResultSchema]
});

const ResultModel = mongoose.model('Result', ResultsSchema);

const fetchAllResults = () => ResultModel.find({}).exec();

const truncateResults = () => ResultModel.deleteMany({}).exec();

const addNewResult = (resObj) => {
    const newResult = new ResultModel(resObj);
    return newResult.save();
}

module.exports = {
    addNewResult,
    truncateResults,
    fetchAllResults
}