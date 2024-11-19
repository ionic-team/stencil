(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[86],{

/***/ 87:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shadow_dom_mode", function() { return ShadowDomMode; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var modeBlueCss = ":host{display:block;padding:100px;background:blue;color:white;font-weight:bold;font-size:32px}", modeRedCss = ":host{display:block;padding:100px;background:red;color:white;font-weight:bold;font-size:32px}", ShadowDomMode = /** @class */ function() {
  function ShadowDomMode(o) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, o), this.mode = Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* i */ "j"])(this);
  }
  return ShadowDomMode.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, this.mode);
  }, ShadowDomMode;
}();

ShadowDomMode.style = {
  blue: modeBlueCss,
  red: modeRedCss
};



/***/ })

}]);