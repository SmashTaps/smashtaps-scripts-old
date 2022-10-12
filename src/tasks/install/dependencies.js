const { deep, pkg, log } = require('../../utils');
const constants = require('../../utils/constants');

module.exports = async function (moduleName, event, callback, config) {
  try {
    if (deep.get(config, constants.CONFIG.installDevDependencies)) {
      log.progress(`${moduleName}-setup`, event, 'dev-deps').start();

      await pkg.update(constants.PACKAGE_KEYS.DEV_DEPS, function (value) {
        return {
          ...value,
          ...callback(value),
        };
      });

      log.progress(`${moduleName}-setup`, event, 'dev-deps').end();
    }
  } catch (error) {
    throw log.error('install:dependencies', error);
  }
};
