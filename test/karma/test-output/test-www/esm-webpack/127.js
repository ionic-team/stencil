(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[127],{

/***/ 128:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "svg_class", function() { return SvgClass; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var SvgClass = /** @class */ function() {
  function SvgClass(s) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, s), this.hasColor = !1;
  }
  return SvgClass.prototype.testClick = function() {
    this.hasColor = !this.hasColor;
  }, SvgClass.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.testClick.bind(this)
    }, "Test")), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("svg", {
      viewBox: "0 0 54 54",
      class: this.hasColor ? "primary" : void 0
    }, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("circle", {
      cx: "8",
      cy: "18",
      width: "54",
      height: "8",
      r: "2",
      class: this.hasColor ? "red" : void 0
    }), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("rect", {
      y: "2",
      width: "54",
      height: "8",
      rx: "2",
      class: this.hasColor ? "blue" : void 0
    }))));
  }, SvgClass;
}();



/***/ })

}]);