(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[102],{

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slot_dynamic_wrapper_root", function() { return SlotDynamicWrapperRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var SlotDynamicWrapperRoot = /** @class */ function() {
  function SlotDynamicWrapperRoot(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.tag = "section";
  }
  return SlotDynamicWrapperRoot.prototype.changeWrapper = function() {
    "section" === this.tag ? this.tag = "article" : this.tag = "section";
  }, SlotDynamicWrapperRoot.prototype.render = function() {
    return [ Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.changeWrapper.bind(this)
    }, "Change Wrapper"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("slot-dynamic-wrapper", {
      tag: this.tag,
      class: "results1"
    }, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("h1", null, "parent text")) ];
  }, SlotDynamicWrapperRoot;
}();



/***/ })

}]);