const path = require('path');

const constants = require('../../utils/constants');
const { log } = require('../../utils');
const { install } = require('../../tasks');

const MODULE_NAME = 'commitizen';
const FILE_PATHS = {
  COMMITIZEN_CONFIG: {
    src: path.join(__dirname, 'files/.czrc'),
    dest: `${constants.FILE_PATHS.ROOT}/.czrc`,
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
            commitizen: '4.2.5',
            '@digitalroute/cz-conventional-changelog-for-jira': '7.4.1',
          };
        },
        moduleConfig
      );

      await install.scripts(
        MODULE_NAME,
        'prepare',
        function () {
          return {
            commit: 'git-cz',
          };
        },
        moduleConfig
      );

      await install.files(
        MODULE_NAME,
        'prepare',
        [
          {
            src: FILE_PATHS.COMMITIZEN_CONFIG.src,
            dest: FILE_PATHS.COMMITIZEN_CONFIG.dest,
          },
        ],
        moduleConfig
      );
    } catch (error) {
      throw log.error(`${MODULE_NAME}-setup`, error);
    }
  },
};
