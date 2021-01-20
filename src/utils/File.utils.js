const fs = require('fs');
const { formatString } = require('./String.utils');

const mkdirIfNotExists = dir => !fs.existsSync(dir) && fs.mkdirSync(dir);

const genUniqueFilename = (strings, ext) => `${strings.map(s => formatString(s)).join("-")}.${ext}`;

module.exports = {
    genUniqueFilename,
    mkdirIfNotExists
}