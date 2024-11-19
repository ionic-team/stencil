(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[19],{

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "child_reflect_nan_attribute", function() { return ChildReflectNanAttribute; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var ChildReflectNanAttribute = /** @class */ function() {
  function ChildReflectNanAttribute(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), 
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0, this.val = void 0;
  }
  return ChildReflectNanAttribute.prototype.render = function() {
    return this.renderCount += 1, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "child-reflect-nan-attribute Render Count: ", this.renderCount);
  }, ChildReflectNanAttribute.prototype.componentDidUpdate = function() {
    // we don't expect the component to update, this will increment the render count in case it does (and should fail
    // the test)
    this.renderCount += 1;
  }, ChildReflectNanAttribute;
}();



/***/ })

}]);