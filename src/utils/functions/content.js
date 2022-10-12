const { deep } = require('./deep');

function extendProperty({ src, prop, type, config, updates }) {
  let updatedValue = deep.get(src, prop, null);

  if (!updatedValue) {
    if (type === 'array') updatedValue = [];
    if (type === 'object') updatedValue = {};
    if (type === 'string') updatedValue = '';
  }

  Object.entries(updates).forEach(function ([key, value]) {
    if (config[key]?.enabled) {
      if (type === 'array') {
        updatedValue = [...new Set(updatedValue.concat(value))];
      }

      if (type === 'object') {
        updatedValue = { ...updatedValue, ...value };
      }

      if (type === 'string') {
        updatedValue = getUniqueString(updatedValue, value);
      }
    }
  });

  return updatedValue;
}

function getUniqueString(originalStr, newStr, seperator = '', pos) {
  if (!originalStr.includes(newStr)) {
    if (pos === 'prepend') {
      return `${newStr} ${seperator} ${originalStr}`;
    }

    return `${originalStr} ${seperator} ${newStr}`;
  }

  return originalStr;
}

function removeFromString(str, strToRemove, separator) {
  return str
    .split(separator)
    .map(function (item) {
      return item.trim();
    })
    .filter(function (item) {
      return item !== strToRemove;
    })
    .join(` ${separator} `);
}

exports.content = {
  extendProperty,
  getUniqueString,
  removeFromString,
};
