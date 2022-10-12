const dependencies = require('./install/dependencies');
const files = require('./install/files');
const scripts = require('./install/scripts');
const configs = require('./install/configs');

const command = require('./run/command');

module.exports = {
  install: {
    dependencies,
    files,
    scripts,
    configs,
  },
  run: {
    command,
  },
};
