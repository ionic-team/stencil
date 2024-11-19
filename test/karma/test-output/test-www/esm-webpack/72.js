(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[72],{

/***/ 73:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parent_with_reflect_child", function() { return MyComponent; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var MyComponent = /** @class */ function() {
  function MyComponent(n) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, n), 
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
  }
  return MyComponent.prototype.render = function() {
    return this.renderCount += 1, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "Parent Render Count: ", this.renderCount), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("child-with-reflection", {
      val: 1
    }));
  }, MyComponent.prototype.componentDidUpdate = function() {
    this.renderCount += 1;
  }, MyComponent;
}();



/***/ })

}]);