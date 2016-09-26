var _ = require('lodash');

var currentLocation = [];
var obj = {};

var levelRegex = /^"([A-Za-z0-9\_\-]*)"$/;
var propertyRegex = /^"([A-Za-z1-9_\-]*)"[\t\ ]+"(.*)"$/;

function convertToArray(location) {
  var currentValue = _.get(obj, location);
  _.set(obj, location, [currentValue]);
}

function stripComments(line) {
  return line.replace(/\/\/.*/, '');
}

function parseLine(line) {

  line = stripComments(line);
  line = line.trim();
  var match;

  if (match = line.match(levelRegex)) {
    var matchedKey = match[1];
    var nextLocation = _.chain(currentLocation).clone().push(matchedKey).value().join('.');

    // If this key already exists, convert it to an array or append to the array
    var checkKey = _.get(obj, nextLocation);
    if (checkKey && !_.isArray(checkKey)) {
      convertToArray(nextLocation);
      currentLocation.push(matchedKey + '[1]');
    } else if (checkKey) {
      nextLocationLength = _.get(obj, nextLocation).length;
      currentLocation.push(matchedKey + '[' + nextLocationLength + ']');
    } else {
      currentLocation.push(match[1]);
    }
  } else if (match = line.match(propertyRegex)) {

    // If this key already exists, append to the array
    var nextLocation = currentLocation.join('.') + '.' + match[1];
    var checkKey = _.get(obj, nextLocation);
    if (checkKey) {
      if (!_.isArray(checkKey)) {
        convertToArray(nextLocation);
        checkKey = _.get(obj, nextLocation);
        checkKey.push(match[2]);
      } else {
        checkKey.push(match[2]);
      }
    } else {
      _.set(obj, currentLocation.join('.') + '.' + match[1], match[2]);
    }
  }

  if (line === '}' || line === '{}') {
    currentLocation.pop();
  }

}

function parse(vdf) {
  obj = {};

  var lines = vdf.split('\n');

  _.forEach(lines, function(line) {
    parseLine(line);
  });

  return obj;
}

exports.parse = parse;
