const mongoose = require('mongoose');
const { ResolutionSchema } = require('./Settings/Resolution.schema');

const SettingsSchema = new mongoose.Schema({
    resolutions: [ResolutionSchema],
});

const SettingsModel = mongoose.model('Settings', SettingsSchema);

const getSettings = () => SettingsModel.findOne({}).exec();

module.exports = {
    getSettings
};