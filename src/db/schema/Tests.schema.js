const mongoose = require('mongoose');

const TestsSchema = new mongoose.Schema({
    title: String,
    url: String,
    type: String,
    image: String,
    filePath: String,
    selector: String,
    isMultiple: Boolean,
    ignoreSelectors: String
});

const TestModel = mongoose.model('Test', TestsSchema);

const fetchAllTests = () => TestModel.find({}).exec();

const getTestById = (id) => TestModel.findOne({ _id: id }).exec();

const getTestByTitle = (title) => TestModel.findOne({ title }).exec();

const removeTest = (id) => TestModel.deleteOne({ _id: id }).exec();

// Add unique check to title
const createNewTest = async ({title, url, type, image, filePath, selector, ignoreSelectors, isMultiple }) => {
    const newObj = new TestModel({ title, url, type, image, filePath, selector, ignoreSelectors, isMultiple });
    return newObj.save();
}

const updateTest = async ({ _id, title, url, ignoreSelectors, type, image, filePath, selector, isMultiple }) => {
    const testDoc = await getTestById(_id);
    testDoc.title = title;
    testDoc.url = url;
    testDoc.type = type;
    testDoc.image = image;
    testDoc.filePath = filePath;
    testDoc.selector = selector;
    testDoc.isMultiple = isMultiple;
    testDoc.ignoreSelectors = ignoreSelectors;
    return testDoc.save();
}

module.exports = {
    updateTest,
    removeTest,
    fetchAllTests,
    getTestByTitle,
    getTestById,
    createNewTest
};