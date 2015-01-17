/**
 * Module dependencies
 */

module.exports = function(css, whitespace) {
  return css.replace(/^ *import(.+)/, function(_, match) {
    return ':import\n  expression: ' + JSON.stringify(match) + '\n'
  });
};
