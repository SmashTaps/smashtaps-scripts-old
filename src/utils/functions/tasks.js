const { log } = require('./log');
const { file } = require('./file');
const constants = require('../constants');

async function writeConfig(config) {
  await file.write(`${constants.FILE_PATHS.ROOT}/.smashtapsscriptsrc`, constants.FILE_TYPES.JSON, config);
}

function taskRunner(config) {
  const preparationQueue = [];
  const initQueue = [];

  const push = function (task) {
    task.prepare &&
      preparationQueue.push({
        name: task.MODULE_NAME,
        task: task.prepare,
        taskConfig: config[task.MODULE_NAME],
      });
    task.init &&
      initQueue.push({
        name: task.MODULE_NAME,
        task: task.init,
        taskConfig: config[task.MODULE_NAME],
      });
  };

  const runTasks = async function (intermediateAction) {
    try {
      if (preparationQueue.length) {
        for (task of preparationQueue) {
          let executedTask = config[task.name];

          try {
            await task.task(task.taskConfig, config);
            executedTask.installed = true;
          } catch (error) {
            executedTask.installed = false;
            throw error;
          }
        }
      }

      if (intermediateAction) {
        await intermediateAction();
      }

      if (initQueue.length) {
        for (task of initQueue) {
          let executedTask = config[task.name];

          try {
            await task.task(task.taskConfig, config);
            executedTask.installed = true;
          } catch (error) {
            executedTask.installed = false;
            throw error;
          }
        }
      }

      await writeConfig(config);
    } catch (error) {
      await writeConfig(config);
      throw log.error('run-task', error);
    }
  };

  return {
    push,
    run: runTasks,
  };
}

exports.tasks = taskRunner;
