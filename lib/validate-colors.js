'use strict';

/**
 * Module exports
 */

module.exports = validateColors;

/**
 * @param {Array} rules
 */

function validateColors(rules) {
  rules.forEach(function (rule) {
    rule.declarations.forEach(function (declaration) {
      if (declaration.type !== 'declaration') {
        return;
      }

      if (declaration.property.indexOf("--") !== -1) {
        return;
      }

      var value = declaration.value;

      if (value.match(/#[0-9a-fA-F]/) || value.match(/(rgb|hsl)a?\([0-9]/i)) {
        var column = declaration.position.start.column;
        var line = declaration.position.start.line;
        throw new Error(
          'Invalid color "' + value + '" near line ' + line + ':' + column + '. ' +
          'Instead, use a variable.'
        );
      }
    });
  });
}
