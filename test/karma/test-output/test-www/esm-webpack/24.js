(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[24],{

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "conditional_rerender_root", function() { return ConditionalRerenderRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var ConditionalRerenderRoot = /** @class */ function() {
  function ConditionalRerenderRoot(o) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, o), this.showContent = !1, this.showFooter = !1;
  }
  return ConditionalRerenderRoot.prototype.componentDidLoad = function() {
    var o = this;
    this.showFooter = !0, setTimeout((function() {
      return o.showContent = !0;
    }), 20);
  }, ConditionalRerenderRoot.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("conditional-rerender", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("header", null, "Header"), this.showContent ? Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("section", null, "Content") : null, this.showFooter ? Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("footer", null, "Footer") : null);
  }, ConditionalRerenderRoot;
}();



/***/ })

}]);