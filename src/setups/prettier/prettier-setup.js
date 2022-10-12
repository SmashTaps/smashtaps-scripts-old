const path = require('path');

const constants = require('../../utils/constants');
const { log } = require('../../utils');
const { install } = require('../../tasks');

const MODULE_NAME = 'prettier';
const FILE_PATHS = {
  IGNORE: {
    src: path.join(__dirname, 'files/.prettierignore'),
    dest: `${constants.FILE_PATHS.ROOT}/.prettierignore`,
  },
  PRETTIERRC: {
    src: path.join(__dirname, 'files/.prettierrc.json'),
    dest: `${constants.FILE_PATHS.ROOT}/.prettierrc.json`,
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
            [MODULE_NAME]: '2.7.1',
            'eslint-config-prettier': '8.5.0',
            'eslint-plugin-prettier': '4.2.1',
          };
        },
        moduleConfig
      );

      await install.scripts(
        MODULE_NAME,
        'prepare',
        function () {
          return {
            format: 'prettier --check',
            'format:fix': 'prettier --write',
            'format:fix:all': "prettier --write './**/*.{js,jsx,ts,tsx,css,md,json}'",
          };
        },
        moduleConfig
      );

      await install.files(
        MODULE_NAME,
        'prepare',
        [
          {
            src: FILE_PATHS.IGNORE.src,
            dest: FILE_PATHS.IGNORE.dest,
          },
          {
            src: FILE_PATHS.PRETTIERRC.src,
            dest: FILE_PATHS.PRETTIERRC.dest,
          },
        ],
        moduleConfig
      );
    } catch (error) {
      throw log.error(`${MODULE_NAME}-setup`, error);
    }
  },
};
