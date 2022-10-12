const fs = require('fs');
const path = require('path');

const constants = require('../../utils/constants');
const { log } = require('../../utils');
const { install } = require('../../tasks');

const MODULE_NAME = 'lint-staged';
const FILE_PATHS = {
  LINT_STAGED_RC: {
    src: path.join(__dirname, 'files/.lintstagedrc'),
    dest: `${constants.FILE_PATHS.ROOT}/.lintstagedrc`,
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
            [MODULE_NAME]: '13.0.3',
          };
        },
        moduleConfig
      );

      await install.files(
        MODULE_NAME,
        'prepare',
        [
          {
            src: FILE_PATHS.LINT_STAGED_RC.src,
            dest: FILE_PATHS.LINT_STAGED_RC.dest,
          },
        ],
        moduleConfig
      );
    } catch (error) {
      throw log.error(`${MODULE_NAME}-setup`, error);
    }
  },
};
