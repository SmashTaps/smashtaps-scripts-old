const { command } = require('./functions/command');
const { content } = require('./functions/content');
const { deep } = require('./functions/deep');
const { file } = require('./functions/file');
const { log } = require('./functions/log');
const { package: pkg } = require('./functions/package');
const { tasks } = require('./functions/tasks');

module.exports = {
  command,
  content,
  deep,
  file,
  log,
  pkg,
  tasks,
};
