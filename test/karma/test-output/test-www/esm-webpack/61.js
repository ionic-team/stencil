(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[61],{

/***/ 61:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lifecycle_unload_root", function() { return LifecycleUnloadRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var LifecycleUnloadRoot = /** @class */ function() {
  function LifecycleUnloadRoot(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e), this.renderCmp = !0;
  }
  return LifecycleUnloadRoot.prototype.testClick = function() {
    this.renderCmp = !this.renderCmp;
  }, LifecycleUnloadRoot.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.testClick.bind(this)
    }, this.renderCmp ? "Remove" : "Add"), this.renderCmp ? Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("lifecycle-unload-a", null) : null);
  }, LifecycleUnloadRoot;
}();



/***/ })

}]);