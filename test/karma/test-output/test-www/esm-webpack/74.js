(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[74],{

/***/ 75:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reflect_nan_attribute", function() { return ReflectNanAttribute; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var ReflectNanAttribute = /** @class */ function() {
  function ReflectNanAttribute(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), 
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0, this.val = void 0;
  }
  return ReflectNanAttribute.prototype.render = function() {
    return this.renderCount += 1, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "reflect-nan-attribute Render Count: ", this.renderCount);
  }, ReflectNanAttribute.prototype.componentDidUpdate = function() {
    // we don't expect the component to update, this will increment the render count in case it does (and should fail
    // the test)
    this.renderCount += 1;
  }, ReflectNanAttribute;
}();



/***/ })

}]);