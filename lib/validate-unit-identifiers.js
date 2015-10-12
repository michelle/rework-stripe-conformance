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

      if (parseInt(val) === 0 && val.length !== 1) {
        var unitIdentifier = /0(.*)/g.exec(val)[1];
        throw new Error(
          'Invalid zero value unit identifier "' + unitIdentifier + '" near line ' +
            pos.line + ':' + pos.column + '. Use "' + property + ': 0" instead.'
        );
      }
    });
  });
}
