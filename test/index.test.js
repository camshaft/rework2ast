/**
 * Module dependencies
 */

var should = require('should');
var rework2ast = require('..');
var ast2template = require('ast2template');

describe('rework2ast', function() {
  it('should work', function() {
    var ast = rework2ast.file(__dirname + '/cases/index.styl');
    var str = ast2template(ast);
    console.log(str);
  });
});
