/**
 * Module dependencies
 */

module.exports = function(css, whitespace) {
  return css.replace(/^ *export(.+)/, function(_, match) {
    return ':export\n  expression: ' + JSON.stringify(match) + '\n';
  });
};
