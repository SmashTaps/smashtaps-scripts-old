const path = require('path');

const constants = require('../../utils/constants');
const { content, log } = require('../../utils');
const { install } = require('../../tasks');

const MODULE_NAME = 'eslint';
const FILE_PATHS = {
  IGNORE: {
    src: path.join(__dirname, 'files/.eslintignore'),
    dest: `${constants.FILE_PATHS.ROOT}/.eslintignore`,
  },
  ESLINTRC: {
    src: path.join(__dirname, 'files/.eslintrc.json'),
    dest: `${constants.FILE_PATHS.ROOT}/.eslintrc.json`,
  },
};

module.exports = {
  MODULE_NAME,
  prepare: async function (moduleConfig, globalConfig) {
    try {
      await install.dependencies(
        MODULE_NAME,
        'prepare',
        function () {
          return {
            [MODULE_NAME]: '8.24.0',
            '@typescript-eslint/eslint-plugin': '5.0.0',
            'eslint-plugin-promise': '6.0.0',
            'eslint-plugin-react': '7.31.8',
            'eslint-config-standard-with-typescript': '^23.0.0',
            'eslint-plugin-import': '^2.25.2',
            'eslint-plugin-n': '^15.0.0',
          };
        },
        moduleConfig
      );

      await install.scripts(
        MODULE_NAME,
        'prepare',
        function () {
          return {
            lint: 'eslint .',
            'lint:fix': 'eslint --fix',
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
            src: FILE_PATHS.ESLINTRC.src,
            dest: FILE_PATHS.ESLINTRC.dest,
            onCopy: function (value) {
              let json = JSON.parse(value);

              json = {
                ...json,
                extends: content.extendProperty({
                  src: json,
                  prop: 'extends',
                  type: 'array',
                  config: globalConfig,
                  updates: {
                    typescript: ['standard-with-typescript'],
                    prettier: ['plugin:prettier/recommended'],
                  },
                }),
                plugins: content.extendProperty({
                  src: json,
                  prop: 'plugins',
                  type: 'array',
                  config: globalConfig,
                  updates: { prettier: ['prettier'] },
                }),
                rules: content.extendProperty({
                  src: json,
                  prop: 'rules',
                  type: 'object',
                  config: globalConfig,
                  updates: { prettier: { 'prettier/prettier': 'error' } },
                }),
              };

              return JSON.stringify(json, null, 2);
            },
          },
        ],
        moduleConfig
      );
    } catch (error) {
      throw log.error(`${MODULE_NAME}-setup:prepare`, error);
    }
  },
};
