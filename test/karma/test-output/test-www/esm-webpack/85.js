(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[85],{

/***/ 86:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shadow_dom_mode_root", function() { return ShadowDomModeRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var ShadowDomModeRoot = /** @class */ function() {
  function ShadowDomModeRoot(o) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, o), this.showRed = !1;
  }
  return ShadowDomModeRoot.prototype.componentDidLoad = function() {
    var o = this;
    setTimeout((function() {
      o.showRed = !0;
    }), 50);
  }, ShadowDomModeRoot.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("shadow-dom-mode", {
      id: "blue",
      colormode: "blue"
    }), this.showRed ? Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("shadow-dom-mode", {
      id: "red"
    }) : null);
  }, ShadowDomModeRoot;
}();



/***/ })

}]);