const { deep, pkg, log } = require('../../utils');
const constants = require('../../utils/constants');

module.exports = async function (moduleName, event, callback, config) {
  try {
    if (deep.get(config, constants.CONFIG.installScripts)) {
      log.progress(`${moduleName}-setup`, event, 'scripts').start();

      await pkg.update(constants.PACKAGE_KEYS.SCRIPTS, function (value) {
        return {
          ...value,
          ...callback(value),
        };
      });

      log.progress(`${moduleName}-setup`, event, 'scripts').end();
    }
  } catch (error) {
    throw log.error('install:scripts', error);
  }
};
