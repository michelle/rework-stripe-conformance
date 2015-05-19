'use strict';

/**
 * Module exports
 */

module.exports = validateZIndices;

/**
 * @param {Array} rules
 */

function validateZIndices(rules) {
  rules.forEach(function (rule) {
    rule.declarations.forEach(function (declaration) {
      if (declaration.type !== 'declaration') {
        return;
      }

      if (declaration.property !== 'z-index') {
        return;
      }

      var column = declaration.position.start.column;
      var line = declaration.position.start.line;

      if (declaration.value.indexOf("var(--") === -1) {
        throw new Error(
          'Invalid z-index "' + declaration.value + '" near line ' + line + ':' + column + '. ' +
          'A z-index value must contain a variable.'
        );
      }
    });
  });
}
