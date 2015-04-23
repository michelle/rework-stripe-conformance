'use strict';

/**
 * Module exports
 */

module.exports = isValidSelector;

/**
 * @param {String} selector
 * @param {String} componentName
 */

function isValidSelector(selector, componentName, composedComponents) {
  if (selector === ':root') {
    return true;
  }

  var OPTIONAL_PART =  '(?:\\-[a-zA-Z0-9]+)?';
  var OPTIONAL_MODIFIER = '(?:\\-\\-[a-zA-Z0-9]+)?';
  var STATE = '\\.is\\-[a-zA-Z0-9]+';
  var RE_VALID_STATE = new RegExp('__VALID(_COMPOSITION)?__[^\\s>+]*' + STATE);
  var OPTIONAL_STATE = '(?:' + STATE + ')?';
  var RE_ELEMENT = /^\s*[a-z]+/;
  // Pass for any is-* classes.
  var RE_CLASS = /(\.|%)[a-zA-Z0-9]*/g;
  var RE_VALID_CLASS = new RegExp('(\\.|%)' + componentName + '\\b' + OPTIONAL_PART + OPTIONAL_MODIFIER + OPTIONAL_STATE, 'g');
  var strippedSelector = selector.replace(RE_VALID_CLASS, '__VALID__');
  if (composedComponents) {
    var RE_VALID_COMPOSITION = new RegExp('(\.|%)(' + composedComponents.join('|') + ')\\b' + OPTIONAL_PART + OPTIONAL_MODIFIER + OPTIONAL_STATE, 'g');
    strippedSelector = strippedSelector.replace(RE_VALID_COMPOSITION, '__VALID_COMPOSITION__');
  }

  if (RE_CLASS.test(strippedSelector) && !RE_VALID_STATE.test(strippedSelector)) {
    return false;
  }

  var selectorWithoutLeadingElement = selector.replace(RE_ELEMENT, '');
  if (selectorWithoutLeadingElement.search(RE_VALID_CLASS) === 0) {
    return true;
  }
  if (RE_VALID_COMPOSITION && selectorWithoutLeadingElement.search(RE_VALID_COMPOSITION) === 0) {
    return true;
  }

  return false;
}
