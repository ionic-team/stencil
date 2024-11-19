(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[34],{

/***/ 26:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "custom_elements_delegates_focus", function() { return CustomElementsDelegatesFocus; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var sharedDelegatesFocusCss = ":host{display:block;border:5px solid red;padding:10px;margin:10px}:host(:focus){border:5px solid green}input{display:block;width:100%}", CustomElementsDelegatesFocus = /** @class */ function() {
  function CustomElementsDelegatesFocus(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e);
  }
  return CustomElementsDelegatesFocus.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* e */ "f"], null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("input", null));
  }, Object.defineProperty(CustomElementsDelegatesFocus, "delegatesFocus", {
    get: function() {
      return !0;
    },
    enumerable: !1,
    configurable: !0
  }), CustomElementsDelegatesFocus;
}();

CustomElementsDelegatesFocus.style = sharedDelegatesFocusCss;



/***/ })

}]);