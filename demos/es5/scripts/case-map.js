(function () {
  'use strict';

  var caseMap = {};
  var DASH_TO_CAMEL = /-[a-z]/g;
  var CAMEL_TO_DASH = /([A-Z])/g;

  /**
   * Module with utilities for converting between "dash-case" and "camelCase"
   * identifiers.
   *
   * @namespace
   * @memberof Polymer
   * @summary Module that provides utilities for converting between "dash-case"
   *   and "camelCase".
   */
  var CaseMap = {

    /**
     * Converts "dash-case" identifier (e.g. `foo-bar-baz`) to "camelCase"
     * (e.g. `fooBarBaz`).
     *
     * @memberof Polymer.CaseMap
     * @param {string} dash Dash-case identifier
     * @return {string} Camel-case representation of the identifier
     */
    dashToCamelCase: function dashToCamelCase(dash) {
      return caseMap[dash] || (caseMap[dash] = dash.indexOf('-') < 0 ? dash : dash.replace(DASH_TO_CAMEL, function (m) {
        return m[1].toUpperCase();
      }));
    },


    /**
     * Converts "camelCase" identifier (e.g. `fooBarBaz`) to "dash-case"
     * (e.g. `foo-bar-baz`).
     *
     * @memberof Polymer.CaseMap
     * @param {string} camel Camel-case identifier
     * @return {string} Dash-case representation of the identifier
     */
    camelToDashCase: function camelToDashCase(camel) {
      return caseMap[camel] || (caseMap[camel] = camel.replace(CAMEL_TO_DASH, '-$1').toLowerCase());
    }
  };

  Polymer.CaseMap = CaseMap;
})();