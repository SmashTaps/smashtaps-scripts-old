const fs = require('fs');
const path = require('path');

const constants = require('../../utils/constants');
const { log, getPackager } = require('../../utils');
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
  prepare: async function (moduleConfig, globalConfig) {
    try {
      const packager = getPackager();
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
            onCopy: function () {
              const json = {
                ...(globalConfig.prettier?.enabled
                  ? {
                      '*.{css,less,scss,html,json,jsx,js}': `${packager} run format:fix`,
                    }
                  : {}),
                ...(globalConfig.eslint?.enabled
                  ? {
                      '*.{jsx, js, ts, tsx}': `${packager} run lint:fix`,
                    }
                  : {}),
              };

              return JSON.stringify(json, null, 2);
            },
          },
        ],
        moduleConfig
      );
    } catch (error) {
      throw log.error(`${MODULE_NAME}-setup`, error);
    }
  },
};
