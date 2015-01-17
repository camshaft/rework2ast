/**
 * Module dependencies
 */

var ws = require('css-whitespace');

/**
 * Parse css whitespace if the string ends in a '}'
 */

exports = module.exports = function whitespace(raw){
  return exports.test(raw) ? ws(raw) : raw;
}

exports.test = function(raw) {
  return /[^}]$/.test(raw.trim());
}
