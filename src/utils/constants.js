const path = require('path');

const root = process.env.PWD;

module.exports = Object.freeze({
  FILE_PATHS: {
    ROOT: root,
    PACKAGE: path.join(root, 'package.json'),
    HUSKY: path.join(root, '/.husky'),
    YARN: path.join(root, '/yarn.lock'),
  },
  FILE_TYPES: {
    JSON: 'json',
    TEXT: 'text',
  },
  PROMPT: {
    ENABLED: 'y',
  },
  PACKAGE_KEYS: {
    DEV_DEPS: 'devDependencies',
    ESLINT: 'eslintConfig',
    DEPS: 'dependencies',
    SCRIPTS: 'scripts',
    LINT_STAGED: 'lintStaged',
    CONFIG: 'config',
  },
  CONFIG: {
    installDevDependencies: 'install.devDependencies',
    installFiles: 'install.files',
    installScripts: 'install.scripts',
    installConfigs: 'install.configs',
  },
});
