/**
 * Module dependencies
 */

var p = [
  // require('./unbuffered'),
  require('./constructors'),
  require('./exports'),
  require('./vars'),
  require('./imports')
];

module.exports = function(css, whitespace) {
  return css.split('\n').map(function(line) {
    return p.reduce(function(acc, fn) {
      return fn(acc, whitespace);
    }, line);
  }).join('\n');
};
