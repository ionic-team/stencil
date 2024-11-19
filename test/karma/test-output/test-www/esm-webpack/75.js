(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[75],{

/***/ 76:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reflect_to_attr", function() { return ReflectToAttr; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var ReflectToAttr = /** @class */ function() {
  function ReflectToAttr(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.str = "single", this.nu = 2, this.undef = void 0, 
    this.null = null, this.bool = !1, this.otherBool = !0, this.disabled = !1, this.dynamicStr = void 0, 
    this.dynamicNu = void 0;
  }
  return ReflectToAttr.prototype.componentDidLoad = function() {
    this.dynamicStr = "value", this.el.dynamicNu = 123;
  }, Object.defineProperty(ReflectToAttr.prototype, "el", {
    get: function() {
      return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* g */ "h"])(this);
    },
    enumerable: !1,
    configurable: !0
  }), ReflectToAttr;
}();



/***/ })

}]);