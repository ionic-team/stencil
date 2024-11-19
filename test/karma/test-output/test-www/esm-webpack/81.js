(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[81],{

/***/ 82:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shadow_dom_array_root", function() { return ShadowDomArrayRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
var __spreadArray = undefined && undefined.__spreadArray || function(r, a, o) {
  if (o || 2 === arguments.length) for (var t, e = 0, s = a.length; e < s; e++) !t && e in a || (t || (t = Array.prototype.slice.call(a, 0, e)), 
  t[e] = a[e]);
  return r.concat(t || Array.prototype.slice.call(a));
};



var ShadowDomArrayRoot = /** @class */ function() {
  function ShadowDomArrayRoot(r) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, r), this.values = [ 0 ];
  }
  return ShadowDomArrayRoot.prototype.addValue = function() {
    this.values = __spreadArray(__spreadArray([], this.values, !0), [ this.values.length ], !1);
  }, ShadowDomArrayRoot.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.addValue.bind(this)
    }, "Add Value"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("shadow-dom-array", {
      values: this.values,
      class: "results1"
    }));
  }, ShadowDomArrayRoot;
}();



/***/ })

}]);