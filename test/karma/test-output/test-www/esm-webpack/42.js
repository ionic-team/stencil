(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[42],{

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dynamic_css_variable", function() { return DynamicCssVariables; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var cmpCss = ":root{--font-color:blue}header{color:var(--font-color)}", DynamicCssVariables = /** @class */ function() {
  function DynamicCssVariables(o) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, o), this.bgColor = "white";
  }
  return DynamicCssVariables.prototype.getBackgroundStyle = function() {
    return this.bgColor && "white" !== this.bgColor ? {
      background: this.bgColor,
      "--font-color": "white"
    } : {};
  }, DynamicCssVariables.prototype.changeColor = function() {
    "white" === this.bgColor ? this.bgColor = "red" : this.bgColor = "white";
  }, DynamicCssVariables.prototype.render = function() {
    return [ Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("header", {
      style: this.getBackgroundStyle()
    }, "Dynamic CSS Variables!!"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("main", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("p", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.changeColor.bind(this)
    }, "Change Color"))) ];
  }, DynamicCssVariables;
}();

DynamicCssVariables.style = cmpCss;



/***/ })

}]);