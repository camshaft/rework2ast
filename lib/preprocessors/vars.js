/**
 * Module dependencies
 */

module.exports = function(css, whitespace) {
  return css.replace(/^ *var(.+)/, function(_, match) {
    return ':var\n  expression: ' + JSON.stringify(match) + '\n';
  });
};
