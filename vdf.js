var _ = require('lodash');

var currentLocation = [];
var obj = {};

var levelRegex = /^"([A-Za-z0-9\_\-]*)"$/;
var propertyRegex = /^"([A-Za-z1-9_\-]*)"[\t\ ]+"(.*)"$/;

function parseLine(line) {

  line = line.trim();
  line = line.replace(/\/\/.+/, '');
  var match;

  if (match = line.match(levelRegex)) {
    currentLocation.push(match[1]);
  } else if (match = line.match(propertyRegex)) {
    if (match[2] === null) {
      console.log(match);
    }
    _.set(obj, currentLocation.join('.') + '.' + match[1], match[2]);
  }

  if (line === '}') {
    currentLocation.pop();
  }

}

function parse(vdf) {
  obj = {};

  var lines = vdf.split('\n');

  _.forEach(lines, function(line) {
    parseLine(line);
  });

  return JSON.stringify(obj);
}

exports.parse = parse;
