/**
 * Module dependencies
 */

module.exports = function(css, whitespace) {
  return css.replace(/^ *\-(.+)/, function(_, match) {
    return ':unbuffered\n  expression: ' + JSON.stringify(match) + '\n';
  });
};
