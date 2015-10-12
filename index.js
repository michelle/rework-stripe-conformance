'use strict';

/**
 * Module dependencies
 */

var validateColors = require('./lib/validate-colors');
var validateCustomProperties = require('./lib/validate-properties');
var validateRules = require('./lib/validate-rules');
var validateSelectors = require('./lib/validate-selectors');
var validateUnitIdentifiers = require('./lib/validate-unit-identifiers');
var validateZIndices = require('./lib/validate-z-indices');

/**
 * Module exports
 */

module.exports = conformance;

/**
 * Constants
 */

var RE_DIRECTIVE = /@define ([A-Z][a-zA-Z]+)/;
var COMPOSITION_RE_DIRECTIVE = /@compose (([A-Z][a-zA-Z]+,?[\s]*)+)/;

/**
 * @param {Object} ast Rework AST
 * @param {Function} reworkInstance
 */

function conformance(ast, reworkInstance) {
  var initialComment = ast.rules[0].comment;

  if (!initialComment) {
    return;
  }

  var isApp = initialComment.match(/@app/);
  var isComponent = initialComment.match(RE_DIRECTIVE);
  var isDefinition = initialComment.match(/@define/);
  var shouldRunBaseTests = isApp || isComponent;
  var rules = getSimpleRules(ast.rules);

  if (shouldRunBaseTests) {
    runBaseTests(rules);
  }

  if (isDefinition) {
    if (isApp) {
      console.warn(
        'WARNING: conflicting directives in header /*' + initialComment + '*/.',
        'Use the @app directive in CSS files that should be checked for style, but that do not ' +
        'represent a single component. A CSS file must either describe a component or be part of an ' +
        'app, but cannot be both.'
      );
      isApp = false;
    }

    if (isComponent) {
      var componentName = initialComment.match(RE_DIRECTIVE)[1].trim();
      var composedComponents;
      if (initialComment.match(COMPOSITION_RE_DIRECTIVE)) {
        composedComponents = initialComment.match(COMPOSITION_RE_DIRECTIVE)[1].trim().split(/(,\s*)|\s+/g);
      }
      var isStrict = true; // initialComment.match(RE_DIRECTIVE)[2] === 'use strict';

      runComponentTests(rules, componentName, composedComponents);
    } else {
      console.warn(
        'WARNING: invalid component name in definition /*' + initialComment + '*/.',
        'Component names must be pascal-case, e.g., ComponentName.'
      );
      return;
    }
  }
}

/**
 * Return an array of simple CSS rulesets, excluding @media rules, etc.
 *
 * @param {Object} rules Rules from Rework AST
 * @return {Array}
 */

function getSimpleRules(rules) {
  var simpleRules = [];
  rules.forEach(function (rule) {
    if (rule.rules) {
      simpleRules = simpleRules.concat(getSimpleRules(rule.rules));
    }
    if (rule.type === 'rule') {
      simpleRules.push(rule);
    }
  });
  return simpleRules;
}

/**
 * Runs tests that applies to components and apps
 *
 * @param {Object} rules Rules from Rework AST
 * @throws Error when rules contain an invalid entry
 */

function runBaseTests(rules) {
  validateRules(rules);
  validateZIndices(rules);
  validateColors(rules);
  validateUnitIdentifiers(rules);
}

/**
 * Runs test that apply to components but not to apps
 *
 * @param {Object} rules Rules from Rework AST
 * @param {string} componentName The PascalCase name of the component
 * @param {Array<string>} composedComponents The PascalCase names of composed components
 */
function runComponentTests(rules, componentName, composedComponents) {
  validateSelectors(rules, componentName, composedComponents);
  validateCustomProperties(rules, componentName);
}
