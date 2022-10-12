const path = require('path');
const { tasks, log, command, deep, file, pkg, content } = require('./utils');
const config = require('./config');
const constants = require('./utils/constants');

async function getUpdatedConfig() {
  let userConfig;

  try {
    userConfig = await file.read(path.join(constants.FILE_PATHS.ROOT, '.smashtapsscriptsrc'));
  } catch (error) {
    log.error('smashtaps-scripts', { message: 'No user config file found so we are using the default config', error });
  } finally {
    return deep.merge(config, JSON.parse(userConfig || '{}'));
  }
}

function isInstallRequired(updatedConfig) {
  return Object.values(updatedConfig).some(function (item) {
    return !item.installed;
  });
}

function shouldInstall(key, updatedConfig) {
  return updatedConfig[key]?.enabled && !updatedConfig[key]?.installed;
}

async function init() {
  const updatedConfig = await getUpdatedConfig();

  if (!isInstallRequired(updatedConfig)) {
    return true;
  }

  try {
    const prompt = require('prompt-sync')({ sigint: true });
    const logo = require('./logo.js');

    const tasksList = tasks(config);

    logo();

    const defaultSetup = prompt(
      'Do you want to install SmashTaps opinionated CRA DX setup? [Y/n]',
      constants.PROMPT.ENABLED
    );

    process.stdout.write('\n\n');

    if (defaultSetup.toLowerCase() === constants.PROMPT.ENABLED) {
      if (shouldInstall('prettier', updatedConfig)) {
        const prettierSetup = require('./setups/prettier/prettier-setup');
        tasksList.push(prettierSetup);
      }

      if (shouldInstall('husky', updatedConfig)) {
        const huskySetup = require('./setups/husky/husky-setup');
        tasksList.push(huskySetup);
      }

      if (shouldInstall('eslint', updatedConfig)) {
        const esLintSetup = require('./setups/eslint/eslint-setup');
        tasksList.push(esLintSetup);
      }

      if (shouldInstall('lint-staged', updatedConfig)) {
        const lintStagedSetup = require('./setups/lint-staged/lint-staged-setup');
        tasksList.push(lintStagedSetup);
      }

      if (shouldInstall('commitlint', updatedConfig)) {
        const commitLintSetup = require('./setups/commit-lint/commit-lint-setup');
        tasksList.push(commitLintSetup);
      }

      if (shouldInstall('commitizen', updatedConfig)) {
        const commitizenSetup = require('./setups/commitizen/commitizen-setup');
        tasksList.push(commitizenSetup);
      }
    }

    const installPackages = async function () {
      await pkg.update(constants.PACKAGE_KEYS.SCRIPTS, function (value) {
        return {
          ...value,
          postinstall: content.removeFromString(value.postinstall || '', 'node ./index.js', '&&'),
        };
      });
      await command.run('yarn install', function (event, data, code) {
        log.stream(['smashtaps-scripts', 'pre-init-chores', 'yarn', 'install'], event, data, code);
      });
      await pkg.update(constants.PACKAGE_KEYS.SCRIPTS, function (value) {
        return {
          ...value,
          postinstall: content.getUniqueString(value.postinstall || '', 'node ./index.js', '&&'),
        };
      });
    };

    tasksList.run(installPackages).catch((e) => console.log(log.error('smashtaps-scripts', e).message));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('error-roshan', error.message);
    } else {
      console.log(log.error('smashtaps-scripts', error).message);
    }
  }
}

module.exports = init;
