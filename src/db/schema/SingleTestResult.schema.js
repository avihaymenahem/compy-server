const mongoose = require('mongoose');

const SingleTestResultSchema = new mongoose.Schema({
    testId: String,
    isPassed: Boolean
});

const SingleTestResultModel = mongoose.model('SingleTestResult', SingleTestResultSchema);
module.exports = {
    SingleTestResultModel,
    SingleTestResultSchema
};