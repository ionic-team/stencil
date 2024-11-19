(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[51],{

/***/ 46:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "input_basic_root", function() { return InputBasicRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var InputBasicRoot = /** @class */ function() {
  function InputBasicRoot(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.value = void 0;
  }
  return InputBasicRoot.prototype.render = function() {
    var t = this;
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("p", null, "Value: ", Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", {
      class: "value"
    }, this.value)), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("input", {
      type: "text",
      value: this.value,
      onInput: function(e) {
        return t.value = e.target.value;
      }
    }));
  }, Object.defineProperty(InputBasicRoot.prototype, "el", {
    get: function() {
      return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* g */ "h"])(this);
    },
    enumerable: !1,
    configurable: !0
  }), InputBasicRoot;
}();



/***/ })

}]);