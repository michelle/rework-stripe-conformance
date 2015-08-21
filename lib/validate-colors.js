'use strict';

/**
 * Module exports
 */

module.exports = validateColors;

var RGBA_REGEX = /(rgb|hsl)a?\([0-9]/i;
var HEX_REGEX = /#[0-9a-fA-F]/;

/**
 * @param {Object} declaration
 */
function getColumnLine(declaration) {
  return {
    column: declaration.position.start.column,
    line: declaration.position.start.line,
  };
}

/**
 * @param {Object} declaration
 * @param {String} type
 */
function validateColor(declaration, type) {
  var value = declaration.value;
  var colLine = getColumnLine(declaration);

  switch (type) {
    case 'root':
      validateRootColors(value, colLine);
      break;
    default:
      validateVarColors(value, colLine);
  }
}

/**
 * @param {String} value
 * @param {Object} colLine
 */
function validateVarColors(value, colLine) {
  if (value.match(HEX_REGEX) || value.match(RGBA_REGEX)) {
    throw new Error(
      'Invalid color "' + value + '" near line ' + colLine.line + ':' + colLine.column + '. ' +
      'Instead, use a variable.'
    );
  }
}

/**
 * @param {String} value
 * @param {Object} colLine
 */
function validateRootColors(value, colLine) {
  if (value.match(RGBA_REGEX)) {
    throw new Error(
      'Invalid color "' + value + '" near line ' + colLine.line + ':' + colLine.column + '. ' +
      'Instead, use a hex value.'
    );
  }
}

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
        validateColor(declaration, 'root');
      } else {
        validateColor(declaration);
      }
    });
  });
}
