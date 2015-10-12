'use strict';

/**
 * Module exports
 */

module.exports = validateUnitIdentifiers;

/**
 * @param {Array} rules
 */

function validateUnitIdentifiers(rules) {
  rules.forEach(function (rule) {
    rule.declarations.forEach(function (declaration) {
      if (declaration.type !== 'declaration') {
        return;
      }

      var val = declaration.value;
      var pos = declaration.position.start;
      var property = declaration.property;

      var openParen = false;
      var group = '';
      var groups = [];
      val.split('').forEach(function(c) {
        if (c === '(') {
          openParen = true;
        }
        if (c === ')') {
          openParen = false;
        }
        if (c === ' ' && !openParen) {
          groups.push(group);
          group = '';
          return;
        }
        group += c;
      });
      groups.push(group);

      groups.forEach(function(v) {
        if (v.indexOf('(') > -1 || v.indexOf(')') > -1) {
          return;
        }

        if (parseInt(v) === 0 && v.length !== 1) {
          var unitIdentifier = /0(.*)/g.exec(v)[1];
          throw new Error(
            'Invalid zero value unit identifier "' + unitIdentifier + '" near line ' +
              pos.line + ':' + pos.column + '. Use "' + property + ': 0" instead.'
          );
        }
      });
    });
  });
}
