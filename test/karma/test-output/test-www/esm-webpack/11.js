(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[11],{

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "attribute_basic", function() { return AttributeBasic; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var AttributeBasic = /** @class */ function() {
  function AttributeBasic(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this._getter = "getter", this.single = "single", this.multiWord = "multiWord", 
    this.customAttr = "my-custom-attr";
  }
  return Object.defineProperty(AttributeBasic.prototype, "getter", {
    get: function() {
      return this._getter;
    },
    set: function(t) {
      this._getter = t;
    },
    enumerable: !1,
    configurable: !0
  }), AttributeBasic.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "single"
    }, this.single), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "multiWord"
    }, this.multiWord), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "customAttr"
    }, this.customAttr), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "getter"
    }, this.getter), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("label", {
      class: "htmlForLabel",
      htmlFor: "a"
    }, "htmlFor"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("input", {
      type: "checkbox",
      id: "a"
    })));
  }, AttributeBasic;
}();



/***/ })

}]);