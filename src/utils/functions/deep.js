function deepGet(obj, query, defaultVal) {
  query = Array.isArray(query)
    ? query
    : query
        .replace(/(\[(\d)\])/g, '.$2')
        .replace(/^\./, '')
        .split('.');
  if (!(query[0] in obj)) {
    return defaultVal;
  }
  obj = obj[query[0]];
  if (obj && query.length > 1) {
    return deepGet(obj, query.slice(1), defaultVal);
  }
  return obj;
}

function deepSet(obj, query, value) {
  query = Array.isArray(query)
    ? query
    : query
        .replace(/(\[(\d)\])/g, '.$2')
        .replace(/^\./, '')
        .split('.');
  if (!(query[0] in obj) && query.length > 1) {
    obj[query[0]] = {};
  }

  if (query.length === 1) {
    obj[query[0]] = value;
  } else {
    obj = obj[query[0]];
  }

  if (obj && query.length > 1) {
    return deepSet(obj, query.slice(1), value);
  }
}

function merge(current, updates) {
  for (key of Object.keys(updates)) {
    if (!current.hasOwnProperty(key) || typeof updates[key] !== 'object') {
      current[key] = updates[key];
    } else {
      merge(current[key], updates[key]);
    }
  }

  return current;
}

exports.deep = {
  get: deepGet,
  set: deepSet,
  merge,
};
