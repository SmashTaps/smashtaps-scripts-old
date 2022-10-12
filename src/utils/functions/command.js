const { spawn } = require('child_process');

function runCommand(command, output) {
  const _command = command.match(/"[^"]+"|[^\s]+/g).map((e) => e.replace(/"(.+)"/, '$1'));

  if (_command[0]) {
    return new Promise(function (resolve, reject) {
      try {
        const child = spawn(_command.splice(0, 1)?.[0], _command);

        child.stdout.on('data', function (chunk) {
          output('stream', chunk);
        });

        child.stderr.on('data', function (chunk) {
          output('error', chunk);
        });

        child.on('close', function (code) {
          output('close', `child process exited with code ${code}`, code);
          resolve();
        });
      } catch (error) {
        reject(error.message);
      }
    });
  }
}

exports.command = {
  run: runCommand,
};
