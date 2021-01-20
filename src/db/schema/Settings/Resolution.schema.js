const mongoose = require('mongoose');

const ResolutionSchema = new mongoose.Schema({
    width: Number,
    weight: Number
});

const ResolutionModel = mongoose.model('Resolution', ResolutionSchema);

module.exports = {
    ResolutionSchema,
    ResolutionModel
};