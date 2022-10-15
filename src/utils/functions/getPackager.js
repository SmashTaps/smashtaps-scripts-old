const fs = require('fs');
const constants = require('../constants');

module.exports = function () {
  return fs.existsSync(constants.FILE_PATHS.YARN) ? 'yarn' : 'npx';
};
