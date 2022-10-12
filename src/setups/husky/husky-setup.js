const path = require('path');

const constants = require('../../utils/constants');
const { log, content } = require('../../utils');
const { install, run } = require('../../tasks');

const MODULE_NAME = 'husky';
const FILE_PATHS = {
  COMMON: {
    src: path.join(__dirname, 'files/common.sh'),
    dest: `${constants.FILE_PATHS.ROOT}/.husky/common.sh`,
  },
  PRE_COMMIT: {
    src: path.join(__dirname, 'files/pre-commit'),
    dest: `${constants.FILE_PATHS.ROOT}/.husky/pre-commit`,
  },
  COMMIT_MSG: {
    src: path.join(__dirname, 'files/commit-msg'),
    dest: `${constants.FILE_PATHS.ROOT}/.husky/commit-msg`,
  },
  PREPARE_COMMIT_MSG: {
    src: path.join(__dirname, 'files/prepare-commit-msg'),
    dest: `${constants.FILE_PATHS.ROOT}/.husky/prepare-commit-msg`,
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
            [MODULE_NAME]: '8.0.1',
            pinst: '3.0.0',
          };
        },
        moduleConfig
      );

      await install.scripts(
        MODULE_NAME,
        'prepare',
        function (value) {
          return {
            ...value,
            ...(value?.postinstall
              ? { postinstall: content.getUniqueString(value.postinstall, 'is-ci || husky install', '&&') }
              : { postinstall: 'is-ci || husky install' }),
            ...(value?.prepack
              ? { prepack: content.getUniqueString(value.prepack, 'is-ci || pinst --disable', '&&', 'prepend') }
              : { prepack: 'is-ci || pinst --disable' }),
            ...(value?.postpack
              ? {
                  postpack: content.getUniqueString(value.postpack, 'is-ci || pinst --disable', '&&', 'prepend'),
                }
              : { postpack: 'is-ci || pinst --disable' }),
          };
        },
        moduleConfig
      );
    } catch (error) {
      throw log.error('husky-setup', error);
    }
  },
  init: async function (moduleConfig, globalConfig) {
    try {
      await run.command(MODULE_NAME, 'init', 'yarn husky install', moduleConfig);
      await run.command(MODULE_NAME, 'init', 'yarn husky add .husky/pre-commit "yarn lint"', moduleConfig);

      const files = [
        {
          src: FILE_PATHS.COMMON.src,
          dest: FILE_PATHS.COMMON.dest,
        },
        {
          src: FILE_PATHS.PRE_COMMIT.src,
          dest: FILE_PATHS.PRE_COMMIT.dest,
          onCopy: function (content) {
            let _content = content;

            if (globalConfig['lint-staged'].enabled) {
              _content += '\n\nyarn lint-staged';
            } else {
              if (globalConfig.eslint.enabled) {
                _content += '\n\nyarn format:fix';
              }

              if (globalConfig.prettier.enabled) {
                _content += '\n\nyarn lint:fix';
              }
            }

            return _content;
          },
        },
      ];

      if (globalConfig.commitlint?.enabled) {
        files.push(
          {
            src: FILE_PATHS.COMMIT_MSG.src,
            dest: FILE_PATHS.COMMIT_MSG.dest,
            onCopy: function (content) {
              return `${content}\n\nyarn commitlint --edit $1`;
            },
          },
          {
            src: FILE_PATHS.PREPARE_COMMIT_MSG.src,
            dest: FILE_PATHS.PREPARE_COMMIT_MSG.dest,
            onCopy: function (content) {
              return `${content}\n\nexec < /dev/tty && node_modules/.bin/cz --hook || true`;
            },
          }
        );
      }

      await install.files(MODULE_NAME, 'init', files, moduleConfig);
    } catch (error) {
      throw log.error(`${MODULE_NAME}-setup:init`, error);
    }
  },
};
