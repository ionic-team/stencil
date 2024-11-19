(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[27],{

/***/ 19:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "css_variables_no_encapsulation", function() { return CssVariablesNoEncapsulation; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var cmpNoEncapsulationCss = ":root{--font-weight:800}.black-local{--background:black;--color:white;background:var(--background);color:var(--color)}.black-global{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}.yellow-global{background:var(--link-background);color:black}", CssVariablesNoEncapsulation = /** @class */ function() {
  function CssVariablesNoEncapsulation(a) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, a);
  }
  return CssVariablesNoEncapsulation.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* e */ "f"], null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "black-local"
    }, "No encapsulation: Black background"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "black-global"
    }, "No encapsulation: Black background (global style)"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "yellow-global"
    }, "No encapsulation: Yellow background (global link)"));
  }, CssVariablesNoEncapsulation;
}();

CssVariablesNoEncapsulation.style = cmpNoEncapsulationCss;



/***/ })

}]);