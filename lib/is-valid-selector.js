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
  var OPTIONAL_PART =  '(?:\\-[a-zA-Z0-9]+)?';
  var OPTIONAL_MODIFIER = '(?:\\-\\-[a-zA-Z0-9]+)?';
  var OPTIONAL_STATE = '(?:\\.is\\-[a-zA-Z0-9]+)?';
  var RE_CLASS = /(\.|%)[a-zA-Z0-9]*/g;
  var RE_VALID_CLASS = new RegExp('(\\.|%)' + componentName + '\\b' + OPTIONAL_PART + OPTIONAL_MODIFIER + OPTIONAL_STATE, 'g');
  var strippedSelector = selector.replace(RE_VALID_CLASS, '__VALID__');
  if (composedComponents) {
    var RE_VALID_COMPOSITION = new RegExp('(\.|%)(' + composedComponents.join('|') + ')\\b' + OPTIONAL_PART + OPTIONAL_MODIFIER + OPTIONAL_STATE, 'g');
    strippedSelector = strippedSelector.replace(RE_VALID_COMPOSITION, '__VALID_COMPOSITION__');
  }

  if (selector === ':root') {
    return true;
  }

  if (strippedSelector.search(RE_CLASS) !== -1) {
    return false;
  }


  if (selector.search(RE_VALID_CLASS) === 0) {
    return true;
  }

  return false;
}
