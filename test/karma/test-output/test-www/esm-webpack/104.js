(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[104],{

/***/ 105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slot_fallback_root", function() { return SlotFallbackRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var SlotFallbackRoot = /** @class */ function() {
  function SlotFallbackRoot(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.contentInc = 0, this.fallbackInc = 0, this.inc = 0, 
    this.slotContent = "slot light dom 0";
  }
  return SlotFallbackRoot.prototype.changeLightDom = function() {
    this.inc++;
  }, SlotFallbackRoot.prototype.changeSlotContent = function() {
    this.contentInc++, this.slotContent = "slot light dom " + this.contentInc;
  }, SlotFallbackRoot.prototype.changeFallbackContent = function() {
    this.fallbackInc++;
  }, SlotFallbackRoot.prototype.render = function() {
    return [ Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.changeFallbackContent.bind(this),
      class: "change-fallback-content"
    }, "Change Fallback Slot Content"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.changeLightDom.bind(this),
      class: "change-light-dom"
    }, this.inc % 2 == 0 ? "Use light dom content" : "Use fallback slot content"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.changeSlotContent.bind(this),
      class: "change-slot-content"
    }, "Change Slot Content"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("slot-fallback", {
      inc: this.fallbackInc,
      class: "results1"
    }, this.inc % 2 != 0 ? [ Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("content-default", null, this.slotContent, " : default"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("content-end", {
      slot: "end"
    }, this.slotContent, " : end"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("content-start", {
      slot: "start"
    }, this.slotContent, " : start") ] : null) ];
  }, SlotFallbackRoot;
}();



/***/ })

}]);