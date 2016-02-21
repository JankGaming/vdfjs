var _ = require('lodash');

var currentLocation = [];
var obj = {};

var levelRegex = /^"([A-Za-z0-9\_\-]*)"$/;
var propertyRegex = /^"([A-Za-z1-9_\-]*)"[\t\ ]+"(.*)"$/;

function parseLine(line) {

  line = line.trim();

  line = stripComments(line);
  var match;

  if (match = line.match(levelRegex)) {
    var matchedKey = match[1];
    var nextLocation = _.clone(currentLocation);
    nextLocation.push(matchedKey);
    nextLocation = nextLocation.join('.');
    var checkKey = _.get(obj, nextLocation);
    if (checkKey && !_.isArray(checkKey)) {
      convertToArray(nextLocation);
      currentLocation.push(matchedKey + '[1]');
    } else if (checkKey && _.isArray(checkKey)){
      nextLocationLength = _.get(obj, nextLocation).length;
      currentLocation.push(matchedKey + '[' + nextLocationLength + ']');
    } else {
      currentLocation.push(match[1]);
    }
  } else if (match = line.match(propertyRegex)) {
    _.set(obj, currentLocation.join('.') + '.' + match[1], match[2]);
  }

  if (line === '}') {
    currentLocation.pop();
  }

}

function convertToArray(location) {
  var currentValue = _.get(obj, location);
  _.set(obj, location, [currentValue]);
}

function stripComments(line) {
  return line.replace(/\/\/.+/, '');
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
