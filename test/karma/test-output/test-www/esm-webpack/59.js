(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[59],{

/***/ 59:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lifecycle_unload_a", function() { return LifecycleUnloadA; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var LifecycleUnloadA = /** @class */ function() {
  function LifecycleUnloadA(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e);
  }
  return LifecycleUnloadA.prototype.componentDidLoad = function() {
    this.results = this.el.ownerDocument.body.querySelector("#lifecycle-unload-results");
  }, LifecycleUnloadA.prototype.disconnectedCallback = function() {
    var e = document.createElement("div");
    e.textContent = "cmp-a unload", this.results.appendChild(e);
  }, LifecycleUnloadA.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("main", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("header", null, "cmp-a - top"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("lifecycle-unload-b", null, "cmp-a - middle"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("footer", null, "cmp-a - bottom"));
  }, Object.defineProperty(LifecycleUnloadA.prototype, "el", {
    get: function() {
      return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* g */ "h"])(this);
    },
    enumerable: !1,
    configurable: !0
  }), LifecycleUnloadA;
}();



/***/ })

}]);