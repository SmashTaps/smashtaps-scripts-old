const { log } = require('./log');
const { deep } = require('./deep');
const { file } = require('./file');
const constants = require('../constants');
const _package = require(constants.FILE_PATHS.PACKAGE);

async function updatePackage(key, cb) {
  try {
    const item = deep.get(_package, key, null);

    deep.set(_package, key, cb(item));

    await file.write(constants.FILE_PATHS.PACKAGE, constants.FILE_TYPES.JSON, _package);
  } catch (error) {
    throw log.error('updatePackage', error);
  }
}

exports.package = {
  update: updatePackage,
};
