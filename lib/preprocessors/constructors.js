/**
 * Module dependencies
 */

module.exports = function(css, whitespace) {
  return css.replace(/^ *([A-Z].*)/, function(_, match) {
    return ':constructor\n  expression: ' + JSON.stringify(match) + '\n';
  });
};
