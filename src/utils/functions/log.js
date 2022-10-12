const chalk = require('chalk');

function logError(name, error) {
  if (Array.isArray(error)) {
    return {
      message: error.map((e) => `${name}::${chalk.red(e.message)}`).join('\n'),
      error,
      isMultiple: true,
    };
  }

  if (error?.isMultiple) {
    return {
      message: error.message
        .split('\n')
        .map((e) => `${name}::${chalk.red(e)}`)
        .join('\n'),
      error,
      isMultiple: true,
    };
  }

  const message = Array.isArray(error)
    ? error.map((e) => `${chalk.red(e.message)}`).join('\n')
    : error.message || error;
  return {
    message: `${name}::${message.indexOf('::') === -1 ? ' ' : ''}${chalk.red(message)}`,
    error,
  };
}

function logStream(path, event, data, code, avoidClearLine) {
  if (!avoidClearLine) {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(0);
  }

  if (event === 'close') {
    if (code === 0) {
      process.stdout.write(`${path.join(':')}: ${chalk.green('Completed Successfully!')}\n\n`);
    } else {
      process.stdout.write(`${path.join(':')}: ${chalk.red(`Task ended with Errors [code: ${code}]!`)}\n\n`);
    }
  } else if (event === 'completed') {
    process.stdout.write(`${path.join(':')}: [${chalk.green(event)}] ${data}\n\n\n`);
  } else if (event === 'running') {
    process.stdout.write(`${path.join(':')}: [${chalk.yellow(event)}] ${data}\n\n`);
  } else if (event === 'error') {
    process.stdout.write(`${path.join(':')}: [${chalk.red(event)}] ${data}`);
  } else {
    process.stdout.write(`${path.join(':')}: [${event}] ${data}`);
  }
}

function progress(name, stage, task) {
  return {
    start: function () {
      logStream([name, stage, task], 'running', `installing ${task} task running...`, true);
    },
    end: function () {
      logStream([name, stage, task], 'completed', `installing ${task} task completed!`, true);
    },
  };
}

exports.log = {
  error: logError,
  stream: logStream,
  progress,
};
