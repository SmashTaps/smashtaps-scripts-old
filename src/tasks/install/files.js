const { deep, log, file } = require('../../utils');
const constants = require('../../utils/constants');

module.exports = async function (moduleName, event, files, config) {
  try {
    if (deep.get(config, constants.CONFIG.installFiles)) {
      log.progress(`${moduleName}-setup`, event, 'files').start();

      await file.copyMultiple(files);

      log.progress(`${moduleName}-setup`, event, 'files').end();
    }
  } catch (error) {
    throw log.error('install:files', error);
  }
};
