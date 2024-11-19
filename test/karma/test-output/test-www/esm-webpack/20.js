(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[20],{

/***/ 12:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "child_with_reflection", function() { return ChildWithReflection; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var ChildWithReflection = /** @class */ function() {
  function ChildWithReflection(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), 
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0, this.val = void 0;
  }
  return ChildWithReflection.prototype.render = function() {
    return this.renderCount += 1, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "Child Render Count: ", this.renderCount), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("input", {
      step: this.val
    }));
  }, ChildWithReflection.prototype.componentDidUpdate = function() {
    this.renderCount += 1;
  }, ChildWithReflection;
}();



/***/ })

}]);