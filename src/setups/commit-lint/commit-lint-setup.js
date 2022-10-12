const path = require('path');

const constants = require('../../utils/constants');
const { log } = require('../../utils');
const { install } = require('../../tasks');

const MODULE_NAME = 'commitlint';
const FILE_PATHS = {
  COMMITLINT_CONFIG: {
    src: path.join(__dirname, 'files/commitlint.config.js'),
    dest: `${constants.FILE_PATHS.ROOT}/commitlint.config.js`,
  },
};

module.exports = {
  MODULE_NAME,

  prepare: async function (moduleConfig) {
    try {
      await install.dependencies(
        MODULE_NAME,
        'prepare',
        function () {
          return {
            '@commitlint/config-conventional': '17.1.0',
            '@commitlint/cli': '17.1.2',
          };
        },
        moduleConfig
      );

      await install.files(
        MODULE_NAME,
        'prepare',
        [
          {
            src: FILE_PATHS.COMMITLINT_CONFIG.src,
            dest: FILE_PATHS.COMMITLINT_CONFIG.dest,
          },
        ],
        moduleConfig
      );
    } catch (error) {
      throw log.error(`${MODULE_NAME}-setup`, error);
    }
  },
};
