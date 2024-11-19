(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[37],{

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "delegates_focus", function() { return DelegatesFocus; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var delegatesFocusCss = ":host{display:block;border:5px solid red;padding:10px;margin:10px}input{display:block;width:100%}:host(:focus){border:5px solid blue}", DelegatesFocus = /** @class */ function() {
  function DelegatesFocus(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e);
  }
  return DelegatesFocus.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* e */ "f"], null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("input", null));
  }, Object.defineProperty(DelegatesFocus, "delegatesFocus", {
    get: function() {
      return !0;
    },
    enumerable: !1,
    configurable: !0
  }), DelegatesFocus;
}();

DelegatesFocus.style = delegatesFocusCss;



/***/ })

}]);