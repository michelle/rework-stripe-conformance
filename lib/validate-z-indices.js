'use strict';

/**
 * Module dependencies
 */

var isValidRule = require('./is-valid-rule');

/**
 * Module exports
 */

module.exports = validateZIndices;

/**
 * @param {Array} rules
 */

function validateZIndices(rules) {
  rules.forEach(function (rule) {
    if (!isValidRule(rule)) return;

    rule.declarations.forEach(function (declaration) {
      if (declaration.type !== 'declaration') {
        return;
      }

      if (declaration.property !== 'z-index') {
        return;
      }

      var column = declaration.position.start.column;
      var line = declaration.position.start.line;

      if (declaration.value.indexOf("--") === -1 || declaration.value.indexOf("var(") === -1) {
        throw new Error(
          'Invalid z-index "' + declaration.value + '" near line ' + line + ':' + column + '. ' +
          'A z-index value must contain a variable.'
        );
      }
    });
  });
}
