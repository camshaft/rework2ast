/**
 * Module dependencies
 */

var rework = require('rework');
var whitespace = require('./whitespace');
var preprocess = require('./preprocessors');

module.exports = Parser;

/**
 * Initialize the parser
 */

function Parser(css, opts) {
  this.source = css;
  this.opts = opts;
  this.plugins = [];
}

Parser.prototype.use = function(fn) {
  this.plugins.push(fn);
};

Parser.prototype.parse = function(rules, source, imports) {
  var self = this;
  return rules.reduce(function(acc, rule) {
    if (rule.type === 'keyframes') return self.visit_keyframes(rule, source, acc);
    if (rule.type === 'supports') self.visit(rule, source, acc);
    if (rule.type === 'host') self.visit(rule, source, acc);
    if (rule.type === 'media') self.visit(rule, source, acc);
    if (rule.type === 'document') self.visit(rule, source, acc);
    if (select(rule, ':export')) return self.visit_export(rule, source, acc);
    if (select(rule, ':import')) return self.visit_import(rule, source, acc);
    if (select(rule, ':var')) return self.visit_var(rule, source, acc);
    if (select(rule, '%')) return self.visit_placeholder(rule, source, acc);
    if (rule.type === 'rule') return self.visit_rule(rule, source, acc);
    return acc;
  }, imports);
};

Parser.prototype.visit_export = function(rule, source, rules) {
  rule.declarations.forEach(function(dec) {
    rules.push({
      type: 'export',
      expression: JSON.parse(dec.value)
    });
  });
  return rules;
};

Parser.prototype.visit_import = function(rule, source, rules) {
  rule.declarations.forEach(function(dec) {
    rules.push({
      type: 'import',
      expression: JSON.parse(dec.value)
    });
  });

  return rules;
};

var expr = /^ *= */;
Parser.prototype.visit_rule = function(rule, source, rules) {
  var name = '[' + rule.selectors.map(function(sel) {
    return '"' + sel.replace(/\(([^)]+)\)/g, function(_, match) {
      return '" + ' + match + ' + "';
    }) + '"';
  }).join(',') + ']';

  rules.push({
    type: 'tag',
    name: name,
    buffer: true,
    props: rule.declarations.reduce(function(acc, dec) {
      acc[dec.property] = {
        expression: expr.test(dec.value) ?
          dec.value.replace(expr, '') :
          JSON.stringify(dec.value)
      };
      return acc;
    }, {})
  });
  return rules;
};

Parser.prototype.visit_var = function(rule, source, rules) {
  rule.declarations.forEach(function(dec) {
    rules.push({
      type: 'var',
      expression: JSON.parse(dec.value)
    });
  });

  return rules;
};

Parser.prototype.toAst = function() {
  var source = this.source;
  var ast = [];
  var css = preprocess(source, whitespace.test(source));

  // TODO pass plugins
  var out = rework(whitespace(css), {source: source});
  return this.parse(out.obj.stylesheet.rules, source, ast);
};

/**
 * Match the rule's selector on prefix
 *
 * @param {Object} rule
 * @param {String} prefix
 * @return {Boolean}
 */

function select(rule, prefix) {
 return rule.selectors && rule.selectors[0] && rule.selectors[0].indexOf(prefix) === 0;
}
