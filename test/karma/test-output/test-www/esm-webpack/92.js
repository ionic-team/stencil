(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[92],{

/***/ 93:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slot_array_complex_root", function() { return SlotArrayComplexRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var SlotArrayComplexRoot = /** @class */ function() {
  function SlotArrayComplexRoot(o) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, o), this.endSlot = !1;
  }
  return SlotArrayComplexRoot.prototype.componentDidLoad = function() {
    this.endSlot = !this.endSlot;
  }, SlotArrayComplexRoot.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("main", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("slot-array-complex", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("header", {
      slot: "start"
    }, "slot - start"), "slot - default", this.endSlot ? Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("footer", {
      slot: "end"
    }, "slot - end") : null));
  }, SlotArrayComplexRoot;
}();



/***/ })

}]);