/**
 * Module dependencies
 */

var imports = require('./imports');
var exports = require('./exports');
var vars = require('./vars');

var p = [
  exports,
  vars,
  imports
];

module.exports = function(css, whitespace) {
  return css.split('\n').map(function(line) {
    return p.reduce(function(acc, fn) {
      return fn(acc, whitespace);
    }, line);
  }).join('\n');
};
