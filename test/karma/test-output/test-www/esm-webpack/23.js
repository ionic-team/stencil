(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[23],{

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "conditional_basic", function() { return ConditionalBasic; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var ConditionalBasic = /** @class */ function() {
  function ConditionalBasic(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.showContent = !1;
  }
  return ConditionalBasic.prototype.testClick = function() {
    this.showContent = !this.showContent;
  }, ConditionalBasic.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Test"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "results"
    }, this.showContent ? "Content" : ""));
  }, ConditionalBasic;
}();



/***/ })

}]);