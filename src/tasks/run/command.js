const { deep, log, command } = require('../../utils');
const constants = require('../../utils/constants');

module.exports = async function (moduleName, event, commandStr, config) {
  try {
    if (deep.get(config, constants.CONFIG.installScripts)) {
      const commands = commandStr?.split(' ');
      const module = ['yarn', 'npm', 'npx'].includes(commands[0]) ? commands[1] : commands[0];

      log.progress(`${moduleName}-setup`, event, module).start();

      await command.run(commandStr, function (streamEvent, data, code) {
        log.stream([`${moduleName}-setup`, module, 'installing'], streamEvent, data, code);
      });

      log.progress(`${moduleName}-setup`, event, module).end();
    }
  } catch (error) {
    throw log.error('run:command', error);
  }
};
