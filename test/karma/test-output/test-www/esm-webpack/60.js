(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[60],{

/***/ 60:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lifecycle_unload_b", function() { return LifecycleUnloadB; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var LifecycleUnloadB = /** @class */ function() {
  function LifecycleUnloadB(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e);
  }
  return LifecycleUnloadB.prototype.componentDidLoad = function() {
    this.results = this.el.ownerDocument.body.querySelector("#lifecycle-unload-results");
  }, LifecycleUnloadB.prototype.disconnectedCallback = function() {
    var e = document.createElement("div");
    e.textContent = "cmp-b unload", this.results.appendChild(e);
  }, LifecycleUnloadB.prototype.render = function() {
    return [ Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("article", null, "cmp-b - top"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("section", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("slot", null)), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("nav", null, "cmp-b - bottom") ];
  }, Object.defineProperty(LifecycleUnloadB.prototype, "el", {
    get: function() {
      return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* g */ "h"])(this);
    },
    enumerable: !1,
    configurable: !0
  }), LifecycleUnloadB;
}();



/***/ })

}]);