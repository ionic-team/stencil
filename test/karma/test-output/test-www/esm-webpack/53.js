(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[53],{

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "key_reorder_root", function() { return KeyReorderRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var KeyReorderRoot = /** @class */ function() {
  function KeyReorderRoot(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e), this.isReversed = !1;
  }
  return KeyReorderRoot.prototype.testClick = function() {
    this.isReversed = !this.isReversed;
  }, KeyReorderRoot.prototype.render = function() {
    var e = [ 0, 1, 2, 3, 4 ];
    return this.isReversed && e.reverse(), [ Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.testClick.bind(this)
    }, "Test"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, e.map((function(e) {
      return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
        key: e,
        id: "item-" + e
      }, e);
    }))) ];
  }, KeyReorderRoot;
}();



/***/ })

}]);