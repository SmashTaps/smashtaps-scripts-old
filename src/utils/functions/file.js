const fs = require('fs');

const { log } = require('./log');
const constants = require('../constants');

async function readFile(src) {
  try {
    return await fs.promises.readFile(src, 'utf8');
  } catch (error) {
    throw log.error('readFile', error);
  }
}

async function copySingle(src, dest, onCopy) {
  try {
    let content = await readFile(src, 'utf8');
    let updatedContent = onCopy?.(content) || content;
    await fs.promises.writeFile(dest, updatedContent);
    await fs.promises.chmod(dest, 0o755);
  } catch (error) {
    throw log.error('copySingle', error);
  }
}

async function copyMultiple(files) {
  try {
    await Promise.all(
      files.map(function (file) {
        return copySingle(file.src, file.dest, file.onCopy);
      })
    );
  } catch (error) {
    throw log.error('copyMultiple', error);
  }
}

async function write(filePath, fileType, content) {
  try {
    const file = fs.createWriteStream(filePath);

    switch (fileType) {
      case constants.FILE_TYPES.JSON:
        await file.write(JSON.stringify(content, null, 2));
        break;
      case constants.FILE_TYPES.TEXT:
        await file.write(content);
        break;
      default:
        break;
    }

    await file.end();
  } catch (error) {
    throw log.error('write', error);
  }
}

exports.file = {
  copySingle,
  copyMultiple,
  write,
  read: readFile,
};
